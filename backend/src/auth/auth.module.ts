import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/user/user.module';
import { AuthService } from './auth.service';
import { JwtAuthGaurd } from './guards/jwt-auth.guard';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    forwardRef(() => UserModule),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'jwt-secret',
      signOptions: {
        expiresIn: '1d',
      },
    }),
  ],
  providers: [AuthService, JwtStrategy, JwtAuthGaurd],
  exports: [AuthService, JwtAuthGaurd],
})
export class AuthModule {}
