import { S3Client } from '@aws-sdk/client-s3';
import { fromIni } from '@aws-sdk/credential-providers';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AwsSdkModule } from 'aws-sdk-v3-nest';

import { UploadsController } from './uploads.controller';
import { UploadsService } from './uploads.service';

@Module({
  imports: [
    AwsSdkModule.registerAsync({
      clientType: S3Client,
      useFactory: async (configService: ConfigService) => {
        return new S3Client({
          region: configService.get<string>('AWS_S3_BUCKET_REGION'),
          credentials: fromIni({
            profile: configService.get<string>('AWS_PROFILE_NAME'),
          }),
        });
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [UploadsController],
  providers: [UploadsService],
})
export class UploadsModule {}
