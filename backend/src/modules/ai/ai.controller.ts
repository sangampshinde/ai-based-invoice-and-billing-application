import {
  Controller,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AiService } from './ai.service';
import { AgentService } from './agent.service';
import {
  DraftReminderDto,
  DraftInvoiceNotesDto,
  AgentMessageDto,
} from './ai.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { User } from '../../database/entities';

@UseGuards(JwtAuthGuard)
@Controller('ai')
export class AiController {
  constructor(
    private aiService: AiService,
    private agentService: AgentService,
  ) {}

  @Post('scan-receipt')
  @UseInterceptors(FileInterceptor('receipt'))
  async scanReceipt(@UploadedFile() file: Express.Multer.File) {
    return this.aiService.scanReceipt(file);
  }

  @Post('summary')
  async generateSummary(@GetUser() user: User) {
    return this.aiService.generateSummary(user.id);
  }

  @Post('reminder')
  async draftReminder(@Body() dto: DraftReminderDto) {
    return this.aiService.draftReminder(dto);
  }

  @Post('notes')
  async draftInvoiceNotes(@Body() dto: DraftInvoiceNotesDto) {
    return this.aiService.draftInvoiceNotes(dto);
  }

  @Post('agent')
  async agentChat(
    @GetUser() user: User,
    @Body() dto: AgentMessageDto,
  ) {
    return this.agentService.processMessage(user.id, dto.message, dto.history);
  }
}
