import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Payment, Invoice } from '../../database/entities';
import { RecordPaymentDto } from './payments.dto';
import { RedisService } from '../../redis/redis.service';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    @InjectRepository(Invoice)
    private invoiceRepository: Repository<Invoice>,
    private dataSource: DataSource,
    private redisService: RedisService,
  ) {}

  async getPayments(userId: string) {
    const rawPayments = await this.paymentRepository
      .createQueryBuilder('p')
      .innerJoin('invoices', 'i', 'p.invoice_id = i.id')
      .innerJoin('clients', 'c', 'i.client_id = c.id')
      .where('p.user_id = :userId', { userId })
      .select([
        'p.id AS id',
        'p.user_id AS user_id',
        'p.invoice_id AS invoice_id',
        'p.amount AS amount',
        'p.payment_date AS payment_date',
        'p.method AS method',
        'p.created_at AS created_at',
        'i.invoice_number AS invoice_number',
        'c.name AS client_name',
      ])
      .orderBy('p.payment_date', 'DESC')
      .getRawMany();

    return rawPayments.map((p) => ({
      ...p,
      amount: Number(p.amount),
    }));
  }

  async recordPayment(userId: string, dto: RecordPaymentDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const invoice = await this.invoiceRepository.findOne({
        where: { id: dto.invoiceId, user_id: userId },
      });
      if (!invoice) throw new NotFoundException('Invoice not found');

      const payment = this.paymentRepository.create({
        user_id: userId,
        invoice_id: dto.invoiceId,
        amount: dto.amount,
        payment_date: dto.paymentDate || new Date().toISOString().slice(0, 10),
        method: dto.method || 'bank_transfer',
      });

      const savedPayment = await queryRunner.manager.save(payment);

      // Update invoice status to 'paid'
      invoice.status = 'paid';
      await queryRunner.manager.save(invoice);

      await queryRunner.commitTransaction();

      await this.redisService.delPattern(`dashboard:${userId}*`);

      return {
        ...savedPayment,
        amount: Number(savedPayment.amount),
      };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
