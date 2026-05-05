import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from 'src/user/auth.service';
import { User } from 'src/user/entities/user.entity';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
    interface Response {}
  }
}

@Injectable()
export class VerifiedMiddleware implements NestMiddleware {
  constructor(private authService: AuthService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies['extreme-token'];
    const verifiedResult = await this.authService.verifiedIdToken(token);

    req.user = verifiedResult.userdata;

    if ('old_token' in verifiedResult) {
      this.authService.setTokenCookie(res, verifiedResult.id_token);
    }

    next();
  }
}
