import { User } from 'src/user/entities/user.entity';
import { TotalFocusTime } from '../entities/total-focus-time.entity';

export const userFocusStub = (user: User): TotalFocusTime => {
  return {
    id: 1,
    total: 0,
    today: 0,
    yesterday: 0,
    lastWeek: 0,
    thisWeek: 0,
    lastMonth: 0,
    thisMonth: 0,
    user,
  };
};
