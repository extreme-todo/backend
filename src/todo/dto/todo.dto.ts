import { Expose, Transform } from 'class-transformer';
import { IsOptional, isArray } from 'class-validator';
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

  @Transform(({ obj }) => {
    if (!isArray(obj)) return null;
    return obj.categories.map((cat) => {
      return { id: cat.id, name: cat.name };
    });
  })
  @Expose()
  categories: Category[] | null;

  @IsOptional()
  @Expose()
  order: number;
}
