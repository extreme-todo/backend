import { Category } from '../../category/entities/category.entity';
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

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  username: string;

  @Column()
  refresh: string;

  @Column()
  access: string;
  
  @OneToMany(() => Todo, (todo) => todo.user)
  todo: Todo[];

  @OneToMany(() => Category, (category) => category.author)
  categories: Category[];

  // TODO : totalFocusTime을 @OneToOne로 연결해야 함
  // FIXME : ITimeStamp였는데 mysql 때문에 string으로 일단 바꿈. 후에 Translate 처리 해야함
  @Column({ default: '{}' })
  totalFocusTime: string;

  // TODO : totalRestTime을 @OneToOne로 연결해야 함
  // FIXME : ITimeStamp였는데 mysql 때문에 string으로 일단 바꿈. 후에 Translate 처리 해야함
  @Column({
    default:
      '{today: 0,yesterday: 0,thisWeek: 0,lastWeek: 0,thisMonth: 0,lastMonth: 0,}',
  })
  totalRestTime: string;

  // TODO : setting을 @OneToOne로 연결해야 함
  // FIXME : ITimeStamp였는데 mysql 때문에 string으로 일단 바꿈. 후에 Translate 처리 해야함
  @Column({ default: '{darkmode: false,extrememode: true,}' })
  setting: string;
}
