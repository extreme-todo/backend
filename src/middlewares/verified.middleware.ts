import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
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
    }
    interface Response {
      userinfo?: INewUserinfo;
    }
  }
}

@Injectable()
export class VerifiedMiddleware implements NestMiddleware {
  constructor(private authService: AuthService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const {
      userinfo: { email, id_token },
    } = req.body || {};

    const verifiedResult = await this.authService.verifiedIdToken(
      email,
      id_token,
    );

    req.userinfo = verifiedResult;

    next();
  }
}
