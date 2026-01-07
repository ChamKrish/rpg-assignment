import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { JwtAuthGaurd } from 'src/auth/guards/jwt-auth.guard';
import { BlogService } from './blog.service';
import { BlogFilterInput } from './dto/blog-filter.input';
import { CreateBlogInput } from './dto/blog.input';
import { BlogModel } from './model/blog.model';

@Resolver()
export class BlogResolver {
  constructor(private blogService: BlogService) {}

  @Mutation(() => BlogModel)
  @UseGuards(JwtAuthGaurd)
  async createBlog(@Args('input') input: CreateBlogInput): Promise<BlogModel> {
    return await this.blogService.create(input.title, input.content);
  }

  @Query(() => [BlogModel])
  @UseGuards(JwtAuthGaurd)
  async blogs(
    @Args('filters', { nullable: true }) filters?: BlogFilterInput,
  ): Promise<BlogModel[]> {
    return await this.blogService.findAll(filters);
  }
}
