import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
  // FIXME : Todo[]였는데 mysql 때문에 string으로 일단 바꿈. 후에 Translate 처리 해야함
  @Column()
  todo: string;

  // TODO : totalFocusTime을 @OneToOne로 연결해야 함
  // FIXME : ITimeStamp였는데 mysql 때문에 string으로 일단 바꿈. 후에 Translate 처리 해야함
  @Column()
  totalFocusTime: string;

  // TODO : totalRestTime을 @OneToOne로 연결해야 함
  // FIXME : ITimeStamp였는데 mysql 때문에 string으로 일단 바꿈. 후에 Translate 처리 해야함
  @Column()
  totalRestTime: string;

  // TODO : setting을 @OneToOne로 연결해야 함
  // FIXME : ITimeStamp였는데 mysql 때문에 string으로 일단 바꿈. 후에 Translate 처리 해야함
  @Column()
  setting: string;

  @Column()
  refresh: string;
}
