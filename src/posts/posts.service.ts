import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import slugify from 'slugify';

import { PaginationArgs } from '../common/dto/pagination.args';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: User, createPostDto: CreatePostDto) {
    const createdPost = await this.prisma.post.create({
      data: {
        creatorId: user.id,
        ...createPostDto,
      },
    });
    createdPost.slug = slugify(
      createdPost.title.slice(0, 64) + ' ' + createdPost.id.slice(0, 8),
    );
    return this.prisma.post.update({
      where: { id: createdPost.id },
      data: createdPost,
    });
  }

  findAll(params: { pagination?: PaginationArgs }) {
    const {
      pagination: { page = 1, size = 10 },
    } = params;
    return this.prisma.post.findMany({
      orderBy: { updatedAt: 'desc' },
      skip: (page - 1) * size,
      take: size,
    });
  }

  async findOne(id: string) {
    try {
      const post = await this.prisma.post.findUniqueOrThrow({
        where: { id },
      });
      return post;
    } catch (error) {
      throw new NotFoundException('Post not found');
    }
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    const currentPost = await this.findOne(id);
    const updateData: UpdatePostDto & { slug?: string } = { ...updatePostDto };
    if (updatePostDto.title) {
      updateData.slug = slugify(
        updatePostDto.title.slice(0, 64) + ' ' + currentPost.id.slice(0, 8),
      );
    }
    const updatedPost = await this.prisma.post.update({
      where: { id },
      data: updateData,
    });
    return updatedPost;
  }

  async remove(id: string) {
    try {
      const post = await this.prisma.post.delete({ where: { id } });
      return post;
    } catch (error) {
      throw new NotFoundException('Post not found');
    }
  }
}
