import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class S3Service {
  private readonly logger = new Logger(S3Service.name);
  private s3: S3;
  private bucket: string;

  constructor(private configService: ConfigService) {
    this.s3 = new S3({
      accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
      region: this.configService.get<string>('AWS_REGION'),
    });
    this.bucket = this.configService.get<string>('AWS_S3_BUCKET');
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const key = `${uuidv4()}-${file.originalname}`;

    try {
      await this.s3
        .upload({
          Bucket: this.bucket,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
        })
        .promise();

      return key;
    } catch (error) {
      this.logger.error('Error uploading file to S3', error);
      throw new Error('Error uploading file');
    }
  }

  getSignedUrl(key: string): string {
    const params = {
      Bucket: this.bucket,
      Key: key,
    };

    return this.s3.getSignedUrl('getObject', params);
  }
}
