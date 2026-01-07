import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { JwtAuthGaurd } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/user/entity/user.entity';
import { BlogService } from './blog.service';
import { BlogFilterInput } from './dto/blog-filter.input';
import { CreateBlogInput } from './dto/blog.input';
import { BlogModel } from './model/blog.model';

@Resolver()
export class BlogResolver {
  constructor(private blogService: BlogService) {}

  @Mutation(() => BlogModel)
  @UseGuards(JwtAuthGaurd)
  async createBlog(
    @Args('input') input: CreateBlogInput,
    @CurrentUser() user: User,
  ): Promise<BlogModel> {
    return await this.blogService.create(user.id, input.title, input.content);
  }

  @Query(() => [BlogModel])
  @UseGuards(JwtAuthGaurd)
  async blogs(
    @CurrentUser() user: User,
    @Args('filters', { nullable: true }) filters?: BlogFilterInput,
  ): Promise<BlogModel[]> {
    return await this.blogService.findAll(user.id, filters);
  }
}
