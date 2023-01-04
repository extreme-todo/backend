import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
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

  // TODO : todo를 @OneToMany로 연결해야 함
  @Column()
  todo: Todo[];

  // TODO : totalFocusTime을 @OneToOne로 연결해야 함
  @Column()
  totalFocusTime: ITimeStamp;

  // TODO : totalRestTime을 @OneToOne로 연결해야 함
  @Column()
  totalRestTime: ITimeStamp;

  // TODO : setting을 @OneToOne로 연결해야 함
  @Column()
  setting: ISetting;
}
