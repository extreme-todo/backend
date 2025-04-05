import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Category } from '../../category/entities/category.entity';

@Entity()
export class FocusedTime {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Category)
  category: Category;

  @Column()
  duration: number; // duration in minutes

  @CreateDateColumn({ type: 'timestamp', default: () => "now()" })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => "now()" })
  updatedAt: Date;
} 