import { Controller, Get, Query, Redirect } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('api/users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('login')
  @Redirect('', 301)
  async googleSignUp() {
    const res = await this.userService.googleLoginApi();
    return { url: res };
  }

  @Get('callback/google')
  async googleCallback(@Query() authCode: string) {
    return this.userService.googleCallback(authCode);
  }
}
