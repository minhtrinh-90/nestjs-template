import { ApiProperty } from '@nestjs/swagger';

export class CreatePresignedUrlDto {
  @ApiProperty()
  filename: string;
}
