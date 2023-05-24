import { Expose, Transform } from 'class-transformer';
import { Category } from 'src/category/entities/category.entity';

export class TodoDto {
  @Expose()
  id: number;

  @Expose()
  createdAt: Date;

  @Expose()
  date: Date;

  @Expose()
  todo: string;

  @Expose()
  duration: number;

  @Expose()
  done: boolean;

  @Expose()
  focusTime: number;

  @Transform(({ obj }) => obj.categories.map(cat => {
    return {id: cat.id, name: cat.name}
  }))
  @Expose()
  categories: Category[];
}
