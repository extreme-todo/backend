import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Todo } from '../../todo/entities/todo.entity';
import { Setting } from '../../setting/entities/setting.entity';
import { TotalRestTime } from 'src/timer/entities/total-rest-time.entity';
import { TotalFocusTime } from 'src/timer/entities/total-focus-time.entity';
import { Category } from '../../category/entities/category.entity';

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

  @OneToOne((type) => TotalFocusTime, (totalFocusTime) => totalFocusTime.user, {
    cascade: true,
  })
  @JoinColumn()
  totalFocusTime: TotalFocusTime;

  @OneToOne((type) => TotalRestTime, (totalRestTime) => totalRestTime.user, {
    cascade: true,
  })
  @JoinColumn()
  totalRestTime: TotalRestTime;

  @OneToOne((type) => Setting, (setting) => setting.user, {
    cascade: true,
  })
  @JoinColumn()
  setting: Setting;
}
