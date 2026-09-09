import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Expense } from '../../database/entities';
import { CreateExpenseDto } from './expenses.dto';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectRepository(Expense)
    private expenseRepository: Repository<Expense>,
  ) {}

  async getExpenses(userId: string) {
    const expenses = await this.expenseRepository.find({
      where: { user_id: userId },
      order: { date: 'DESC' },
    });

    return expenses.map((e) => ({
      ...e,
      amount: Number(e.amount),
    }));
  }

  async createExpense(userId: string, dto: CreateExpenseDto) {
    const expense = this.expenseRepository.create({
      user_id: userId,
      category: dto.category,
      amount: dto.amount,
      date: dto.date || new Date().toISOString().slice(0, 10),
      vendor: dto.vendor || '',
      notes: dto.notes || '',
    });

    const saved = await this.expenseRepository.save(expense);
    return {
      ...saved,
      amount: Number(saved.amount),
    };
  }
}
