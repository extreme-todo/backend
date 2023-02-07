import { User } from '../entities/user.entity';

export const userStub = (): User[] => {
  return [
    {
      id: 1,
      email: 'exampleOne@ex.com',
      username: 'exampleOne',
      refresh: 'qwer1234!@#$',
      access: 'asdf1234!@#$',
      todo: `[{id: 1,date: new Date('Dec 27, 2022 18:00:30'),todo: 'Go to grocery store',duration: 60 * 60,done: true,category: '["chore", "family affair"]',},{id: 2,date: new Date('Dec 29, 2022 18:00:30'),todo: 'Go to Gym',duration: 60 * 60,done: false,category: '["health"]',}]`,
      totalFocusTime:
        '{today: 123123123,yesterday: 123123123,thisWeek: 123123123,lastWeek: 123123123,thisMonth: 123123123,lastMonth: 123123123,}',
      totalRestTime:
        '{today: 123123123,yesterday: 123123123,thisWeek: 123123123,lastWeek: 123123123,thisMonth: 123123123,lastMonth: 123123123,}',
      setting: '{darkmode: true,extrememode: true,}',
    },
    {
      id: 2,
      email: 'exampleTwo@ex.com',
      username: 'exampleTwo',
      refresh: 'qwer1234!@#$',
      access: 'asdf1234!@#$',
      todo: `[{id: 1,date: new Date('Dec 27, 2022 18:00:30'),todo: 'Go to grocery store',duration: 60 * 60,done: true,category: '["chore", "family affair"]',},{id: 2,date: new Date('Dec 29, 2022 18:00:30'),todo: 'Go to Gym',duration: 60 * 60,done: false,category: '["health"]',}]`,
      totalFocusTime:
        '{today: 123123123,yesterday: 123123123,thisWeek: 123123123,lastWeek: 123123123,thisMonth: 123123123,lastMonth: 123123123,}',
      totalRestTime:
        '{today: 123123123,yesterday: 123123123,thisWeek: 123123123,lastWeek: 123123123,thisMonth: 123123123,lastMonth: 123123123,}',
      setting: '{darkmode: true,extrememode: false,}',
    },
    {
      id: 3,
      email: 'exampleThree@ex.com',
      username: 'exampleThree',
      refresh: 'qwer1234!@#$',
      access: 'asdf1234!@#$',
      todo: `[{id: 1,date: new Date('Dec 27, 2022 18:00:30'),todo: 'Go to grocery store',duration: 60 * 60,done: true,category: '["chore", "family affair"]',},{id: 2,date: new Date('Dec 29, 2022 18:00:30'),todo: 'Go to Gym',duration: 60 * 60,done: false,category: '["health"]',}]`,
      totalFocusTime:
        '{today: 123123123,yesterday: 123123123,thisWeek: 123123123,lastWeek: 123123123,thisMonth: 123123123,lastMonth: 123123123,}',
      totalRestTime:
        '{today: 123123123,yesterday: 123123123,thisWeek: 123123123,lastWeek: 123123123,thisMonth: 123123123,lastMonth: 123123123,}',
      setting: '{darkmode: false,extrememode: true,}',
    },
    {
      id: 4,
      email: 'exampleFour@ex.com',
      username: 'exampleFour',
      refresh: 'qwer1234!@#$',
      access: 'asdf1234!@#$',
      todo: `[{id: 1,date: new Date('Dec 27, 2022 18:00:30'),todo: 'Go to grocery store',duration: 60 * 60,done: true,category: '["chore", "family affair"]',},{id: 2,date: new Date('Dec 29, 2022 18:00:30'),todo: 'Go to Gym',duration: 60 * 60,done: false,category: '["health"]',}]`,
      totalFocusTime:
        '{today: 123123123,yesterday: 123123123,thisWeek: 123123123,lastWeek: 123123123,thisMonth: 123123123,lastMonth: 123123123,}',
      totalRestTime:
        '{today: 123123123,yesterday: 123123123,thisWeek: 123123123,lastWeek: 123123123,thisMonth: 123123123,lastMonth: 123123123,}',
      setting: '{darkmode: true,extrememode: true,}',
    },
  ];
};
