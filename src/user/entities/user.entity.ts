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
import { Ranking } from 'src/ranking/entities/ranking.entity';

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

  @OneToOne(() => TotalFocusTime, (totalFocusTime) => totalFocusTime.user, {
    cascade: true,
  })
  totalFocusTime: TotalFocusTime;

  @OneToOne(() => TotalRestTime, (totalRestTime) => totalRestTime.user, {
    cascade: true,
  })
  totalRestTime: TotalRestTime;

  @OneToOne(() => Setting, (setting) => setting.user, {
    cascade: true,
  })
  setting: Setting;

  @OneToMany(() => Ranking, (ranking) => ranking.user)
  @JoinColumn()
  ranking: Ranking[];
}
