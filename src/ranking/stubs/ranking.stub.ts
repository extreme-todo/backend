import { Category } from 'src/category/entities/category.entity';
import { User } from 'src/user/entities/user.entity';

export const rankingStub = (): Ranking[] => {
  return [
    {
      id: 1,
      user: { id: 1, email: 'examOne@ex.com' } as User,
      time: 1000 * 60 * 60,
      category: { id: 1, name: 'programming' } as Category,
    },
    {
      id: 2,
      user: { id: 2, email: 'examTwo@ex.com' } as User,
      time: 1000 * 60 * 30,
      category: { id: 2, name: 'english' } as Category,
    },
    {
      id: 3,
      user: { id: 1, email: 'examOne@ex.com' } as User,
      time: 1000 * 60 * 16,
      category: { id: 3, name: 'math' } as Category,
    },
  ];
};
