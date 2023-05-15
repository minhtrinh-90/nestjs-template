import { IsNotEmpty, MinLength } from 'class-validator';

import { SignInDto } from './signin.dto';

export class SignUpDto extends SignInDto {
  @IsNotEmpty()
  @MinLength(3)
  name: string;
}
