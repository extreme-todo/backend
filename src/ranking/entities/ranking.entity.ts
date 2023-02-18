import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from 'src/category/entities/category.entity';
import { User } from 'src/user/entities/user.entity';

@Entity()
export class Ranking {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Category, (category) => category.ranking, {
    cascade: true,
  })
  @JoinColumn()
  category: Category;

  @ManyToOne(() => User, (user) => user.ranking, {
    cascade: true,
  })
  user: User;

  @Column()
  time: number;
}
