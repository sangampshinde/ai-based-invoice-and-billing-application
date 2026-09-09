import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './clients.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { User } from '../../database/entities';

@UseGuards(JwtAuthGuard)
@Controller('clients')
export class ClientsController {
  constructor(private clientsService: ClientsService) {}

  @Get()
  async getClients(@GetUser() user: User) {
    return this.clientsService.getClients(user.id);
  }

  @Post()
  async createClient(
    @GetUser() user: User,
    @Body() dto: CreateClientDto,
  ) {
    return this.clientsService.createClient(user.id, dto);
  }

  @Get(':id')
  async getClientById(@GetUser() user: User, @Param('id') id: string) {
    return this.clientsService.getClientById(user.id, id);
  }
}
