import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entity/user.entity';
import {
  JwtSignPayload,
  JwtVerifiedPayload,
} from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  generateToken(user: User): string {
    const payload: JwtSignPayload = {
      sub: user.id,
      userName: user.userName,
      email: user.email,
    };

    return this.jwtService.sign(payload);
  }

  validateToken(token: string): JwtVerifiedPayload | null {
    try {
      return this.jwtService.verify<JwtVerifiedPayload>(token);
    } catch (err) {
      console.log(err);
      return null;
    }
  }
}
