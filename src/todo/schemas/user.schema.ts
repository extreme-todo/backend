import { Prop, Schema } from '@nestjs/mongoose';

// TODO : 할 일이 추가되면 user DB의 todo 테이블에 Todo DB의 새로 추가된 항목의 objectID가 추가되어야 한다.
@Schema()
export class user {
  @Prop()
  email: string;
  @Prop()
  username: string;
}
