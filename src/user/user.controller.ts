import { Controller, Get, Query, Redirect } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('api/users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('callback/google/start')
  @Redirect('', 302)
  googleSignUp() {
    const url = this.userService.googleLoginApi();
    return { url };
  }

  @Get('callback/google/finish')
  googleCallback(@Query() authCode: string) {
    return this.userService.googleCallback(authCode);
  }
}
