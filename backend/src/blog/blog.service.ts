import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Like, Repository } from 'typeorm';
import { BlogFilterInput } from './dto/blog-filter.input';
import { Blog } from './entity/blog.entity';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(Blog)
    private blogRepository: Repository<Blog>,
  ) {}

  async create(title: string, content: string): Promise<Blog> {
    const blog = this.blogRepository.create({
      title,
      content,
    });

    return await this.blogRepository.save(blog);
  }

  async findAll(filter?: BlogFilterInput): Promise<Blog[]> {
    const search = filter?.search?.trim();
    const createdAt = Between(
      filter?.createdAtGe ?? new Date(0),
      filter?.createdAtLe ?? new Date(Date.now()),
    );
    const createdAtFilter = createdAt ? { createdAt } : {};

    return await this.blogRepository.find({
      where: search
        ? [
            { title: Like(`%${search}%`), ...createdAtFilter },
            { content: Like(`%${search}%`), ...createdAtFilter },
          ]
        : createdAtFilter,
      order: { createdAt: 'DESC' },
    });
  }
}
