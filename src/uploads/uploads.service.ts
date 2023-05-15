import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectAws } from 'aws-sdk-v3-nest';

@Injectable()
export class UploadsService {
  constructor(
    private readonly configService: ConfigService,
    @InjectAws(S3Client) private readonly s3Client: S3Client,
  ) {}

  async createPresignedUrl(filename: string) {
    const command = new PutObjectCommand({
      Bucket: this.configService.get<string>('AWS_S3_BUCKET_NAME'),
      Key: filename,
    });
    try {
      const signedUrl = await getSignedUrl(this.s3Client, command);
      return signedUrl;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Cannot generate pre-signed URL');
    }
  }
}
