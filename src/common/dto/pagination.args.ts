import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class PaginationArgs {
  @ApiPropertyOptional({ type: Number })
  @Transform(({ value }) => +value)
  size?: number;

  @ApiPropertyOptional({ type: Number })
  @Transform(({ value }) => +value)
  page?: number;
}
