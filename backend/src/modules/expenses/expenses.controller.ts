import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './expenses.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { User } from '../../database/entities';

@UseGuards(JwtAuthGuard)
@Controller('expenses')
export class ExpensesController {
  constructor(private expensesService: ExpensesService) {}

  @Get()
  async getExpenses(@GetUser() user: User) {
    return this.expensesService.getExpenses(user.id);
  }

  @Post()
  async createExpense(
    @GetUser() user: User,
    @Body() dto: CreateExpenseDto,
  ) {
    return this.expensesService.createExpense(user.id, dto);
  }
}
