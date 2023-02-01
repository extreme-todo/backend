import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Todo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: Date;

  @Column()
  todo: string;

  @Column()
  duration: number;

  @Column({ default: false })
  done: boolean;

  @ManyToOne(() => User, (user) => user.todo)
  user: User;

  // TODO : 수능 영어 단어 => 이처럼 여러 가지 카테고리가 중복될 수 있지 않을까?
  @Column()
  category: string;
}
