import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type TodoDocument = Todo & Document;

export interface ITodo {
  todo: string;
  duration: number;
  done: boolean;
  category: string[];
}

@Schema({ collection: 'todos' })
export class Todo {
  // @Prop({ type: mongoose.Schema.Types.ObjectId })
  // _id: mongoose.Types.ObjectId;

  @Prop({ default: new Date(), type: mongoose.Schema.Types.Date })
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
