import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Client } from './client.entity';
import { Invoice } from './invoice.entity';
import { Payment } from './payment.entity';
import { Expense } from './expense.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ name: 'company_name', type: 'varchar', length: 255, nullable: true })
  company_name: string;

  @Column({ name: 'company_email', type: 'varchar', length: 255, nullable: true })
  company_email: string;

  @Column({ name: 'company_address', type: 'text', nullable: true })
  company_address: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  created_at: Date;

  @OneToMany(() => Client, (client) => client.user)
  clients: Client[];

  @OneToMany(() => Invoice, (invoice) => invoice.user)
  invoices: Invoice[];

  @OneToMany(() => Payment, (payment) => payment.user)
  payments: Payment[];

  @OneToMany(() => Expense, (expense) => expense.user)
  expenses: Expense[];
}
