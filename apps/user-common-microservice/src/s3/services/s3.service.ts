import {
  PutObjectCommand,
  PutObjectCommandInput,
  PutObjectCommandOutput,
  S3Client,
} from '@aws-sdk/client-s3';
import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ACL_REGIME } from '../../../../../shared/constants/common';

@Injectable()
export class S3Service {
  constructor(private readonly configService: ConfigService) {}

  async uploadFile(file: Express.Multer.File, key: string) {
    const s3Bucket = this.configService.get<string>('s3.bucket');
    const s3Region = this.configService.get<string>('s3.region');
    const s3Input: PutObjectCommandInput = {
      Body: file.buffer,
      Bucket: s3Bucket,
      Key: key,
      ContentType: file.mimetype,
      ACL: ACL_REGIME.PUBLIC_READ,
    };
    const s3: S3Client = new S3Client({
      region: s3Region,
      credentials: {
        accessKeyId: this.configService.get<string>('s3.accessKey'),
        secretAccessKey: this.configService.get<string>('s3.secretAccessKey'),
      },
    });
    const response: PutObjectCommandOutput = await s3.send(
      new PutObjectCommand(s3Input),
    );
    if (response.$metadata.httpStatusCode == 200) {
      return { url: `https://${s3Bucket}.s3.${s3Region}.amazonaws.com/${key}` };
    }
    throw new BadRequestException(
      'Something went wrong, image not saved to s3',
    );
  }
}
