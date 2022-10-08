import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type TodoDocument = Todo & Document;

@Schema({ collection: 'todos' })
export class Todo {
  @Prop()
  _id: string;

  @Prop({ default: new Date(), type: Date })
  date: Date;

  @Prop({ type: String, required: true })
  todo: string;

  @Prop({ type: Number })
  duration: number;

  @Prop({ type: Boolean, required: true, default: false })
  done: boolean;
  // 수능 영어 단어 => 이처럼 여러 가지 카테고리가 중복될 수 있지 않을까?
  @Prop({ type: [String] })
  category: string[];
}

export const TodoSchema = SchemaFactory.createForClass(Todo);
