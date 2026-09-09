import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto, UpdateInvoiceStatusDto } from './invoices.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { User } from '../../database/entities';

@UseGuards(JwtAuthGuard)
@Controller('invoices')
export class InvoicesController {
  constructor(private invoicesService: InvoicesService) {}

  @Get()
  async getInvoices(@GetUser() user: User) {
    return this.invoicesService.getInvoices(user.id);
  }

  @Post()
  async createInvoice(
    @GetUser() user: User,
    @Body() dto: CreateInvoiceDto,
  ) {
    return this.invoicesService.createInvoice(user.id, dto);
  }

  @Get(':id')
  async getInvoiceById(
    @GetUser() user: User,
    @Param('id') id: string,
  ) {
    return this.invoicesService.getInvoiceById(user.id, id);
  }

  @Patch(':id/status')
  async updateInvoiceStatus(
    @GetUser() user: User,
    @Param('id') id: string,
    @Body() dto: UpdateInvoiceStatusDto,
  ) {
    return this.invoicesService.updateInvoiceStatus(user.id, id, dto.status);
  }
}
