import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { RecordPaymentDto } from './payments.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { User } from '../../database/entities';

@UseGuards(JwtAuthGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Get()
  async getPayments(@GetUser() user: User) {
    return this.paymentsService.getPayments(user.id);
  }

  @Post()
  async recordPayment(
    @GetUser() user: User,
    @Body() dto: RecordPaymentDto,
  ) {
    return this.paymentsService.recordPayment(user.id, dto);
  }
}
