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
  googleCallback(@Query() authCode: string) {
    return this.authService.googleCallback(authCode);
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

  @Post('/revoke')
  async revokeUser(@CurrentUser() user: User) {
    return await this.authService.revokeToken(user);
  }
}
