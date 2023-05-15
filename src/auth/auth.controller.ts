import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Response } from 'express';

import { User } from '../_gen/prisma-class/user';
import { CookieConfig } from '../common/configs/config.interface';
import { BaseErrorModel } from '../common/models/base-error.model';
import { ValidationErrorModel } from '../common/models/validation-error.model';
import { AuthService } from './auth.service';
import { CurrentUser } from './current-user.decorator';
import { SignInDto } from './dto/signin.dto';
import { SignUpDto } from './dto/signup.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Token } from './models/token.model';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly usersService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({
    type: BaseErrorModel,
    description: 'User not logged in',
  })
  @ApiOkResponse({
    type: User,
    description: 'Info about the user based on auth token',
  })
  findCurrentUser(@CurrentUser() user: User) {
    return user;
  }

  @Post('signup')
  @ApiConflictResponse({
    type: BaseErrorModel,
    description: 'Email is already in use',
  })
  @ApiBadRequestResponse({
    type: ValidationErrorModel,
    description: 'Validation error',
  })
  @ApiCreatedResponse({ type: Token, description: 'Sign-up successful' })
  async signUp(
    @Body() signUpDto: SignUpDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = await this.usersService.signUp(
      signUpDto,
    );
    res.cookie(
      'jwt',
      accessToken,
      this.configService.get<CookieConfig>('cookie'),
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  @Post('signin')
  @ApiBadRequestResponse({
    type: ValidationErrorModel,
    description: 'Validation error',
  })
  @ApiNotFoundResponse({
    type: BaseErrorModel,
    description: 'Email not in use',
  })
  @ApiUnauthorizedResponse({
    type: BaseErrorModel,
    description: 'Invalid password',
  })
  @ApiOkResponse({ type: Token, description: 'Sign-in successful' })
  @HttpCode(200)
  async signIn(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = await this.usersService.signIn(
      signInDto,
    );
    res.cookie(
      'jwt',
      accessToken,
      this.configService.get<CookieConfig>('cookie'),
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  @Post('signout')
  @ApiOkResponse({ type: String, description: 'Sign-out successful' })
  @HttpCode(200)
  signOut(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('jwt', this.configService.get<CookieConfig>('cookie'));
    return this.usersService.signOut();
  }
}
