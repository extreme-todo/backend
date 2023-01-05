import { Injectable } from '@nestjs/common';
import { FocusService } from './focus.service';
import { RestService } from './rest.service';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class TimerService {
  constructor(
    private focusService: FocusService,
    private restService: RestService,
  ) {}

  initTimer(user: User) {}
}
