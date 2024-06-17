import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { IncomingHttpHeaders } from 'http';
import { AuthService } from 'src/user/auth.service';
import { User } from 'src/user/entities/user.entity';

declare global {
  namespace Express {
    interface Request {
      user?: User;
      headers?: IncomingHttpHeaders & {
        'extreme-token'?: string;
        'extreme-email'?: string;
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
      req.headers['extreme-email'] as string,
      req.headers['extreme-token'] as string,
    );

    req.user = verifiedResult.userdata;

    next();
  }
}
