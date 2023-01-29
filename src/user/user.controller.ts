import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
  Redirect,
} from '@nestjs/common';
import { Serialize } from 'src/interceptor/serialize.interceptor';
import { UserDto } from './dto/user.dto';
import { UserService } from './user.service';

@Controller('/api/users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/callback/google/start')
  @Redirect('', 302)
  googleSignUp() {
    const url = this.userService.googleLoginApi();
    return { url };
  }

  @Get('/callback/google/finish')
  googleCallback(@Query() authCode: string) {
    return this.userService.googleCallback(authCode);
  }

  @Serialize(UserDto)
  @Get('/:email')
  async findUser(@Param('email') email: string) {
    const user = await this.userService.findOne(email);
    console.log(user);
    if (!user) {
      console.log('여기 옴');
      throw new NotFoundException('user not found');
    }
    return user;
  }
}
