import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class Post {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;

  @ApiProperty({ type: String })
  title: string;

  @ApiPropertyOptional({ type: String })
  slug?: string;

  @ApiProperty({ type: String })
  content: string;

  @ApiPropertyOptional({ type: String })
  imageUrl?: string;

  @ApiProperty({ type: String })
  tags: string;

  @ApiProperty({ type: String })
  creatorId: string;
}
