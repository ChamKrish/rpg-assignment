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

  async create(
    authorId: string,
    title: string,
    content: string,
  ): Promise<Blog> {
    const blog = this.blogRepository.create({
      title,
      content,
      authorId,
    });

    return await this.blogRepository.save(blog);
  }

  async findAll(authorId: string, filters?: BlogFilterInput): Promise<Blog[]> {
    const search = filters?.search?.trim();
    const createdAt = Between(
      filters?.createdAtGe ?? new Date(0),
      filters?.createdAtLe ?? new Date(Date.now()),
    );
    const baseFilter = createdAt ? { createdAt } : {};

    if (filters?.createdByMe) {
      baseFilter['authorId'] = authorId;
    }

    return await this.blogRepository.find({
      where: search
        ? [
            { title: Like(`%${search}%`), ...baseFilter },
            { content: Like(`%${search}%`), ...baseFilter },
          ]
        : baseFilter,
      order: { createdAt: 'DESC' },
      relations: { author: true },
    });
  }
}
