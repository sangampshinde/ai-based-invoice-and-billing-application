import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Invoice, InvoiceItem, Client } from '../../database/entities';
import { CreateInvoiceDto } from './invoices.dto';
import { RedisService } from '../../redis/redis.service';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice)
    private invoiceRepository: Repository<Invoice>,
    @InjectRepository(InvoiceItem)
    private itemRepository: Repository<InvoiceItem>,
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
    private dataSource: DataSource,
    private redisService: RedisService,
  ) {}

  async getInvoices(userId: string) {
    const rawInvoices = await this.invoiceRepository
      .createQueryBuilder('i')
      .innerJoin('clients', 'c', 'i.client_id = c.id')
      .where('i.user_id = :userId', { userId })
      .select([
        'i.id AS id',
        'i.user_id AS user_id',
        'i.client_id AS client_id',
        'i.invoice_number AS invoice_number',
        'i.issue_date AS issue_date',
        'i.due_date AS due_date',
        'i.status AS status',
        'i.notes AS notes',
        'i.subtotal AS subtotal',
        'i.tax AS tax',
        'i.total AS total',
        'i.created_at AS created_at',
        'c.name AS client_name',
        'c.email AS client_email',
      ])
      .orderBy('i.created_at', 'DESC')
      .getRawMany();

    return rawInvoices.map((inv) => ({
      ...inv,
      subtotal: Number(inv.subtotal),
      tax: Number(inv.tax),
      total: Number(inv.total),
    }));
  }

  async getInvoiceById(userId: string, id: string) {
    const invoiceRaw = await this.invoiceRepository
      .createQueryBuilder('i')
      .innerJoin('clients', 'c', 'i.client_id = c.id')
      .where('i.id = :id AND i.user_id = :userId', { id, userId })
      .select([
        'i.id AS id',
        'i.user_id AS user_id',
        'i.client_id AS client_id',
        'i.invoice_number AS invoice_number',
        'i.issue_date AS issue_date',
        'i.due_date AS due_date',
        'i.status AS status',
        'i.notes AS notes',
        'i.subtotal AS subtotal',
        'i.tax AS tax',
        'i.total AS total',
        'i.created_at AS created_at',
        'c.name AS client_name',
        'c.email AS client_email',
        'c.address AS client_address',
      ])
      .getRawOne();

    if (!invoiceRaw) throw new NotFoundException('Invoice not found');

    const items = await this.itemRepository.find({
      where: { invoice_id: id },
    });

    return {
      ...invoiceRaw,
      subtotal: Number(invoiceRaw.subtotal),
      tax: Number(invoiceRaw.tax),
      total: Number(invoiceRaw.total),
      items: items.map((it) => ({
        id: it.id,
        invoice_id: it.invoice_id,
        description: it.description,
        quantity: Number(it.quantity),
        rate: Number(it.rate),
        amount: Number(it.amount),
      })),
    };
  }

  async createInvoice(userId: string, dto: CreateInvoiceDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Calculate financial amounts
      let subtotal = 0;
      const computedItems = (dto.items || []).map((item) => {
        const itemQty = parseFloat(String(item.quantity)) || 1;
        const itemRate = parseFloat(String(item.rate)) || 0;
        const itemAmount = Number((itemQty * itemRate).toFixed(2));
        subtotal += itemAmount;
        return {
          description: item.description,
          quantity: itemQty,
          rate: itemRate,
          amount: itemAmount,
        };
      });

      const taxRate = parseFloat(String(dto.taxRate || 0));
      const tax = Number((subtotal * (taxRate / 100)).toFixed(2));
      const total = Number((subtotal + tax).toFixed(2));

      // Sequential per-user invoice numbering
      const count = await this.invoiceRepository.count({
        where: { user_id: userId },
      });
      const nextNumber = `INV-${String(count + 1).padStart(4, '0')}`;

      const invoice = this.invoiceRepository.create({
        user_id: userId,
        client_id: dto.clientId,
        invoice_number: nextNumber,
        issue_date: dto.issueDate,
        due_date: dto.dueDate,
        notes: dto.notes || '',
        subtotal,
        tax,
        total,
      });

      const savedInvoice = await queryRunner.manager.save(invoice);

      for (const item of computedItems) {
        const lineItem = this.itemRepository.create({
          invoice_id: savedInvoice.id,
          description: item.description,
          quantity: item.quantity,
          rate: item.rate,
          amount: item.amount,
        });
        await queryRunner.manager.save(lineItem);
      }

      await queryRunner.commitTransaction();

      // Invalidate analytics/dashboard cache in Redis
      await this.redisService.delPattern(`dashboard:${userId}*`);

      return {
        ...savedInvoice,
        subtotal: Number(savedInvoice.subtotal),
        tax: Number(savedInvoice.tax),
        total: Number(savedInvoice.total),
        items: computedItems,
      };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async updateInvoiceStatus(userId: string, id: string, status: string) {
    const invoice = await this.invoiceRepository.findOne({
      where: { id, user_id: userId },
    });
    if (!invoice) throw new NotFoundException('Invoice not found');

    invoice.status = status;
    const updated = await this.invoiceRepository.save(invoice);

    await this.redisService.delPattern(`dashboard:${userId}*`);
    return {
      ...updated,
      subtotal: Number(updated.subtotal),
      tax: Number(updated.tax),
      total: Number(updated.total),
    };
  }
}
