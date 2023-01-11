import { User } from 'src/user/entities/user.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Setting {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 'auto' })
  colorMode: 'light' | 'dark' | 'auto';

  @Column({ default: true })
  extremeMode: boolean;

  @OneToOne(() => User, (user) => user.setting)
  user: User;
}
