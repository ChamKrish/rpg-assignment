import {
  NotFoundException,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { JwtAuthGaurd } from 'src/auth/guards/jwt-auth.guard';
import { LoginInput, RegisterInput } from '../auth/dto/auth.input';
import { User } from './entity/user.entity';
import { AuthPayload, UserModel } from './model/user.model';
import { UserService } from './user.service';

@Resolver()
export class UserResolver {
  constructor(private userService: UserService) {}

  @Mutation(() => AuthPayload)
  async register(@Args('input') input: RegisterInput): Promise<AuthPayload> {
    const user = await this.userService.create(
      input.userName,
      input.email,
      input.password,
    );

    const token = await this.userService.getValidUserToken(user);

    return {
      token,
      user: {
        id: user.id,
        userName: user.userName,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  }

  @Mutation(() => AuthPayload)
  async login(@Args('input') input: LoginInput): Promise<AuthPayload> {
    const user = await this.userService.findByEmail(input.email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await this.userService.validatePassword(
      input.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = await this.userService.getValidUserToken(user);

    return {
      token,
      user: {
        id: user.id,
        userName: user.userName,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  }

  @Query(() => UserModel, { nullable: true })
  @UseGuards(JwtAuthGaurd)
  autoLogin(@CurrentUser() user: User): UserModel {
    return {
      id: user.id,
      userName: user.userName,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
