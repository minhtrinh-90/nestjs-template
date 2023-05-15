import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'nestjs-prisma';

import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import config from './common/configs/config';
import { prismaLoggingMiddleware } from './common/middlewares/prisma-logging.middleware';
import { PostsModule } from './posts/posts.module';
import { UploadsModule } from './uploads/uploads.module';

const ENV = process.env.NODE_ENV;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
      envFilePath: !ENV ? '.env' : `.env.${ENV}`,
    }),
    PrismaModule.forRoot({
      isGlobal: true,
      prismaServiceOptions: {
        explicitConnect: true,
        middlewares: [prismaLoggingMiddleware(new Logger('PrismaMiddleware'))],
      },
    }),
    AuthModule,
    UploadsModule,
    PostsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
