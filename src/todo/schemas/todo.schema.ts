import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, mongo } from 'mongoose';

export type TodoDocument = Todo & Document;

@Schema({ timestamps: { createdAt: 'createdAt' }, autoIndex: true })
export class Todo {
  @Prop()
  _id: string;

  @Prop({ default: new Date(), type: mongoose.Schema.Types.Date })
  date: Date;

  @Prop({ type: mongoose.Schema.Types.String, required: true })
  todo: string;

  @Prop({ type: mongoose.Schema.Types.Number })
  duration: number;

  @Prop({ type: mongoose.Schema.Types.Boolean, required: true, default: false })
  done: boolean;

  @Prop({ type: mongoose.Schema.Types.String })
  category: string;
}

export const TodoSchema = SchemaFactory.createForClass(Todo);
