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
  Index,
} from 'typeorm';

@Entity()
export class Todo {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'datetime' })
  date: Date;

  @Column()
  todo: string;

  @Column()
  duration: number;

  @Column({ default: false })
  done: boolean;

  @Column({ default: 0 })
  focusTime: number;

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

  @Index()
  @Column({ default: null, nullable: true })
  order: number;
}
