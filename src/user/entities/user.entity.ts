import { Category } from 'src/category/entities/category.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Todo } from '../../todo/entities/todo.entity';

export interface ITimeStamp {
  today: number;
  yesterday: number;
  thisWeek: number;
  lastWeek: number;
  thisMonth: number;
  lastMonth: number;
}

export interface ISetting {
  darkmode: boolean;
  extrememode: boolean;
}

// const timeStamp = {
//   today: { type: Number, default: 0 },
//   yesterday: { type: Number, default: 0 },
//   thisWeek: { type: Number, default: 0 },
//   lastWeek: { type: Number, default: 0 },
//   thisMonth: { type: Number, default: 0 },
//   lastMonth: { type: Number, default: 0 },
// };

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  username: string;

  @OneToMany(() => Category, (report) => report.author)
  categories: Category[];
}
