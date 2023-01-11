import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Todo } from '../../todo/entities/todo.entity';
import { TotalRestTime } from 'src/timer/entities/total-rest-time.entity';
import { TotalFocusTime } from 'src/timer/entities/total-focus-time.entity';

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

// DISCUSSION : TotalFocusTime이랑 TotalRestTime에 이거 쓸 거 같음
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
  // QUESTION : String으로 JSON.stringify 처리 해줘야 하게..ㅆ지?
  // FIXME : 배열은 'mysql' 데이터베이스에서 사용할 수 없는 데이터라는 오류 발생
  // @Column()
  // todo: Todo[];

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

  // TODO : setting을 @OneToOne로 연결해야 함
  // FIXME : 오브젝트는 'mysql' 데이터베이스에서 사용할 수 없는 데이터라는 오류 발생
  // @Column()
  // setting: ISetting;
}
