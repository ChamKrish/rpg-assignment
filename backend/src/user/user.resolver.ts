import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { LoginInput, RegisterInput } from '../auth/dto/auth.input';
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

    return {
      token: 'token', // Update with jwt token
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

    return {
      token: 'token', // Update with jwt token
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
  async autoLogin(): Promise<UserModel | null> {
    // Update with auth using jwt
    return null;
  }
}
