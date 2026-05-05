import {
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Query,
  Redirect,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { Serialize } from 'src/interceptor/serialize.interceptor';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { UserDto } from './dto/user.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Controller('/api/users')
export class UserController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  private CLIENT_URL = this.configService.get('CLIENT_URL');

  @Get('/callback/google/start')
  @Redirect('', 302)
  googleSignUp() {
    const url = this.authService.googleLoginApi();
    return { url };
  }

  @Get('/callback/google/finish')
  async googleCallback(
    @Query() authCode: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const token = await this.authService.googleCallback(authCode);
      this.authService.setTokenCookie(res, token);
      res.redirect(this.CLIENT_URL);
    } catch (err) {
      if (err.response?.statusCode === 500) {
        res.redirect(this.CLIENT_URL);
      }
    }
  }

  @Serialize(UserDto)
  @Get('/me')
  getMe(@CurrentUser() user: User) {
    return user;
  }

  @Post('/logout')
  @HttpCode(204)
  logout(@Res({ passthrough: true }) res: Response) {
    this.authService.clearTokenCookie(res);
  }

  @Serialize(UserDto)
  @Get('/:email')
  async findUser(@Param('email') email: string) {
    const user = await this.userService.findUser(email);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }

  @Delete('/revoke')
  async revokeUser(@CurrentUser() user: User) {
    return await this.authService.revokeToken(user);
  }
}
