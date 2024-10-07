import {
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  Redirect,
  UseGuards,
} from '@nestjs/common';
import { Serialize } from 'src/interceptor/serialize.interceptor';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { UserDto } from './dto/user.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('/api/users')
export class UserController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Get('/callback/google/start')
  @Redirect('', 302)
  googleSignUp() {
    const url = this.authService.googleLoginApi();
    return { url };
  }

  @Get('/callback/google/finish')
  @Redirect('', 302)
  async googleCallback(@Query() authCode: string) {
    try {
      const url = await this.authService.googleCallback(authCode);
      return { url };
    } catch (err) {
      if (err.response.statusCode === 500)
        return { url: 'https://extreme-frontend.fly.dev/' };
    }
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
