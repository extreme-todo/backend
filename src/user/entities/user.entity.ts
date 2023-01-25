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

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  username: string;

  @Column()
  refresh: string;

  // QUESTION : 어차피 mysql이라서 translate도 못하고 stringify 해서 처리해야 하지 않나? 그리고 Time친구들 {}로 초기화 해도 상관없겠지?..

  // TODO : todo를 @OneToMany로 연결해야 함
  // FIXME : Todo[]였는데 mysql 때문에 string으로 일단 바꿈. 후에 Translate 처리 해야함
  @Column({ default: '[]' })
  todo: string;

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
