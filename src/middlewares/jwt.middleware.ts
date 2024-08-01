import {
  Injectable,
  NestMiddleware,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  private readonly JWT_SECRET: string = process.env.JWT_SECRET;

  use(req: Request<string, any>, res: Response, next: NextFunction): void {
    const token = req.headers['authorization'] as string;

    if (!token) {
      throw new HttpException('Token not found', HttpStatus.UNAUTHORIZED);
    }

    try {
      const payload = jwt.verify(token, this.JWT_SECRET);
      req['user'] = payload;
      next();
    } catch (err) {
      throw new HttpException(
        'Expired or invalid token',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
