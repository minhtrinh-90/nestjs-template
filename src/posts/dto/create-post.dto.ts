import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ type: String })
  @IsString()
  @MinLength(3)
  title: string;

  @ApiProperty({ type: String })
  @IsString()
  @MinLength(10)
  content: string;

  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({ type: String })
  tags: string;
}
