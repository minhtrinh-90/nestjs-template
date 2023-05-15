import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { User } from '@prisma/client';

import { Post as BlogPost } from '../_gen/prisma-class/post';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PaginationArgs } from '../common/dto/pagination.args';
import { BaseErrorModel } from '../common/models/base-error.model';
import { ValidationErrorModel } from '../common/models/validation-error.model';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsService } from './posts.service';

@Controller('posts')
@ApiTags('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({
    type: BaseErrorModel,
    description: 'User not logged in',
  })
  @ApiBadRequestResponse({
    type: ValidationErrorModel,
    description: 'Validation error',
  })
  @ApiCreatedResponse({ type: BlogPost, description: 'Post created' })
  create(@CurrentUser() user: User, @Body() createPostDto: CreatePostDto) {
    return this.postsService.create(user, createPostDto);
  }

  @Get()
  @ApiOkResponse({ type: BlogPost, isArray: true, description: 'Posts found' })
  findAll(@Query() queries: PaginationArgs) {
    return this.postsService.findAll({ pagination: queries });
  }

  @Get(':id')
  @ApiNotFoundResponse({ type: BaseErrorModel, description: 'Post not found' })
  @ApiOkResponse({ type: BlogPost, description: 'Post found' })
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({
    type: BaseErrorModel,
    description: 'User not logged in',
  })
  @ApiNotFoundResponse({ type: BaseErrorModel, description: 'Post not found' })
  @ApiOkResponse({ type: BlogPost, description: 'Post updated' })
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(id, updatePostDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({
    type: BaseErrorModel,
    description: 'User not logged in',
  })
  @ApiNotFoundResponse({ type: BaseErrorModel, description: 'Post not found' })
  @ApiOkResponse({ type: BlogPost, description: 'Post deleted' })
  remove(@Param('id') id: string) {
    return this.postsService.remove(id);
  }
}
