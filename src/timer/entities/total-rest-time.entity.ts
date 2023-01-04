import { User } from 'src/user/entities/user.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TotalRestTime {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 0 })
  total: number;

  @Column({ default: 0 })
  today: number;

  @Column({ default: 0 })
  yesterday: number;

  @Column({ default: 0 })
  thisWeek: number;

  @Column({ default: 0 })
  lastWeek: number;

  @Column({ default: 0 })
  thisMonth: number;

  @Column({ default: 0 })
  lastMonth: number;

  @OneToOne(() => User, (user) => user.totalRestTime)
  user: User;
}
