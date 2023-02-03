import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * 현재 로그인중인 사용자 User 리턴
 */
export const CurrentUser = createParamDecorator(
  (data: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.userinfo.userdata;
  },
);
