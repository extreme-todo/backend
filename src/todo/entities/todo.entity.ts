import { Category } from '../../category/entities/category.entity';
import { User } from '../../user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Todo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp' })
  date: Date;

  @Column()
  todo: string;

  @Column()
  duration: number;

  @Column({ default: false })
  done: boolean;

  @ManyToOne(() => User, (user) => user.todo)
  @JoinColumn()
  user: User;

  @ManyToMany(() => Category, (category) => category.todos, { nullable: true })
  @JoinColumn()
  categories: Category[];
}
