import { User } from '../../user/entities/user.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

export type ColorMode = 'light' | 'dark' | 'auto';

@Entity()
export class Setting {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 'auto' })
  colorMode: ColorMode;

  @Column({ default: true })
  extremeMode: boolean;

  @OneToOne(() => User, (user) => user.setting)
  user: User;
}
