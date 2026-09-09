import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './auth.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { User } from '../../database/entities';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.register(dto);
    this.setTokenCookie(res, result.token);
    return { user: result.user, token: result.token };
  }

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(dto);
    this.setTokenCookie(res, result.token);
    return { user: result.user, token: result.token };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@GetUser() user: User) {
    return this.authService.getMe(user.id);
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    const isProd = process.env.NODE_ENV === 'production';
    res.clearCookie('token', {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      path: '/',
    });
    return { message: 'Logged out successfully' };
  }

  private setTokenCookie(res: Response, token: string) {
    const isProd = process.env.NODE_ENV === 'production';
    res.cookie('token', token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });
  }
}
