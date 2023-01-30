import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('api/users')
export class UserController {
  constructor(private userService: UserService) {}
  @Get('login')
  async googleSignUp() {
    console.log('hello');
    // return this.userService.googleLoginApi();
  }
}
