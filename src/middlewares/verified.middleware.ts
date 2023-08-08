import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { IncomingHttpHeaders } from 'http';
import { AuthService } from 'src/user/auth.service';
import { User } from 'src/user/entities/user.entity';

interface INewUserinfo {
  userdata: User;
  id_token: string;
}

declare global {
  namespace Express {
    interface Request {
      userinfo?: INewUserinfo;
      headers?: IncomingHttpHeaders & {
        extremetoken?: string;
        extremeemail?: string;
      };
    }
    interface Response {}
  }
}

@Injectable()
export class VerifiedMiddleware implements NestMiddleware {
  constructor(private authService: AuthService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const verifiedResult = await this.authService.verifiedIdToken(
      req.headers['extremeemail'] as string,
      req.headers['extremetoken'] as string,
    );

    req.userinfo = verifiedResult;

    next();
  }
}
