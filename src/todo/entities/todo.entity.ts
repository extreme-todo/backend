import { Category } from '../../category/entities/category.entity';
import { User } from '../../user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  ManyToMany,
  PrimaryGeneratedColumn,
  JoinTable,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Todo {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'timestamp' })
  date: Date;

  @Column()
  todo: string;

  @Column()
  duration: number;

  @Column({ default: false })
  done: boolean;

  @ManyToOne(() => User, (user) => user.todo, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User;

  @ManyToMany(() => Category, (category) => category.todos, {
    nullable: true,
    eager: true,
  })
  @JoinTable()
  categories: Category[];
}
