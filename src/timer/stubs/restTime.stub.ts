import { User } from 'src/user/entities/user.entity';
import { TotalRestTime } from '../entities/total-rest-time.entity';

export const userRestStub = (user: User): TotalRestTime => {
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
