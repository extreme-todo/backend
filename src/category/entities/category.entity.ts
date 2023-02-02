import { Todo } from '../../todo/entities/todo.entity';
import { User } from '../../user/entities/user.entity';
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @ManyToMany(() => Todo, (todo) => todo.categories)
  todos: Todo[];

  @ManyToOne(() => User, (user) => user.categories)
  author: User;
}
