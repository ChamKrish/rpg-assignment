import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PubSub } from 'graphql-subscriptions';
import { PUB_SUB } from './blog.constants';
import { BlogResolver } from './blog.resolver';
import { BlogService } from './blog.service';
import { Blog } from './entity/blog.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Blog])],
  providers: [
    BlogResolver,
    BlogService,
    { provide: PUB_SUB, useValue: new PubSub() },
  ],
  exports: [BlogService],
})
export class BlogModule {}
