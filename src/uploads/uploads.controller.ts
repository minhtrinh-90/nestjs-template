import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BaseErrorModel } from '../common/models/base-error.model';
import { CreatePresignedUrlDto } from './dto/create-presigned-url.dto';
import { UploadsService } from './uploads.service';

@ApiTags('uploads')
@UseGuards(JwtAuthGuard)
@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('/presigned-url')
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({
    type: BaseErrorModel,
    description: 'User not logged in',
  })
  @ApiCreatedResponse({ type: String, description: 'Presigned URL created' })
  async createPresignUrl(@Body() createPresignedUrlDto: CreatePresignedUrlDto) {
    return this.uploadsService.createPresignedUrl(
      createPresignedUrlDto.filename,
    );
  }
}
