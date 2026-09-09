import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client, Invoice } from '../../database/entities';
import { CreateClientDto } from './clients.dto';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
    @InjectRepository(Invoice)
    private invoiceRepository: Repository<Invoice>,
  ) {}

  async getClients(userId: string) {
    const rawClients = await this.clientRepository
      .createQueryBuilder('c')
      .leftJoin('invoices', 'i', 'c.id = i.client_id')
      .where('c.user_id = :userId', { userId })
      .select([
        'c.id AS id',
        'c.user_id AS user_id',
        'c.name AS name',
        'c.email AS email',
        'c.company AS company',
        'c.phone AS phone',
        'c.address AS address',
        'c.created_at AS created_at',
        `COALESCE(SUM(i.total), 0) AS total_billed`,
        `COALESCE(SUM(CASE WHEN i.status != 'paid' THEN i.total ELSE 0 END), 0) AS outstanding`,
      ])
      .groupBy('c.id')
      .orderBy('c.created_at', 'DESC')
      .getRawMany();

    return rawClients.map((c) => ({
      ...c,
      total_billed: Number(c.total_billed),
      outstanding: Number(c.outstanding),
    }));
  }

  async createClient(userId: string, dto: CreateClientDto) {
    const client = this.clientRepository.create({
      user_id: userId,
      name: dto.name,
      email: dto.email,
      company: dto.company || '',
      phone: dto.phone || '',
      address: dto.address || '',
    });
    return this.clientRepository.save(client);
  }

  async getClientById(userId: string, id: string) {
    const client = await this.clientRepository.findOne({
      where: { id, user_id: userId },
    });
    if (!client) throw new NotFoundException('Client not found');

    const invoices = await this.invoiceRepository.find({
      where: { client_id: id, user_id: userId },
      order: { created_at: 'DESC' },
    });

    return {
      client,
      invoices,
    };
  }
}
