import { Todo } from '../../todo/entities/todo.entity';
import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Ranking } from 'src/ranking/entities/ranking.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @ManyToMany(() => Todo, (todo) => todo.categories)
  todos: Todo[];

  @OneToMany(() => Ranking, (ranking) => ranking.category)
  ranking: Ranking[];
}
