import { Prop, raw, Schema } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Todo } from './todo.schema';

export interface ITimeStamp {
  today: number;
  yesterday: number;
  thisWeek: number;
  lastWeek: number;
  thisMonth: number;
  lastMonth: number;
}

export interface ISetting {
  darkmode: boolean;
  extrememode: boolean;
}

const timeStamp = {
  today: { type: Number, default: 0 },
  yesterday: { type: Number, default: 0 },
  thisWeek: { type: Number, default: 0 },
  lastWeek: { type: Number, default: 0 },
  thisMonth: { type: Number, default: 0 },
  lastMonth: { type: Number, default: 0 },
};

@Schema({ collection: 'users' })
export class user {
  @Prop({ type: String, required: true })
  email: string;

  @Prop({ type: String, required: true })
  username: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Todo' }] })
  todo: Todo[];

  @Prop(raw(timeStamp))
  totalFocusTime: ITimeStamp;

  @Prop(raw(timeStamp))
  totalRestTime: ITimeStamp;

  @Prop(
    raw({
      darkmode: { type: Boolean },
      extrememode: { type: Boolean, default: false },
    }),
  )
  setting: ISetting;
}
