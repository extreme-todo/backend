import { Controller, Get, Query, Redirect } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('api/users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('login')
  googleSignUp() {
    return this.userService.googleLoginApi();
  }

  // @Get('callback/google')
  // googleCallback(@Query() authCode: string) {
  //   return this.userService.googleCallback(authCode);
  // }
}
