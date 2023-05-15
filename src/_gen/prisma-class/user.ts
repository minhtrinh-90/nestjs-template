import { UserRole } from '.pnpm/@prisma+client@4.14.0_prisma@4.14.0/node_modules/@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class User {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;

  @ApiProperty({ type: String })
  email: string;

  @ApiProperty({ type: String })
  password: string;

  @ApiProperty({ type: String })
  name: string;

  @ApiPropertyOptional({ type: String })
  avatar?: string;

  @ApiProperty({ enum: UserRole, enumName: 'UserRole' })
  role: UserRole = UserRole.USER;
}
