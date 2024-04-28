// aws-s3.service.ts
import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { Upload } from '@aws-sdk/lib-storage';
import { Readable } from 'stream';
import { ConfigApp } from 'src/config/config';

@Injectable()
export class S3StorageService {
  private s3Client: S3Client;

  constructor() {
    this.s3Client = new S3Client({
      region: ConfigApp.aws_region,
      credentials: {
        accessKeyId: ConfigApp.aws_access_key_id,
        secretAccessKey: ConfigApp.aws_secret_access_key,
      },
    });
  }

  async uploadFile(file: any, key: string) {
    if (!file || !file.buffer) {
      throw new Error('No file or buffer provided for upload');
    }

    const stream = Readable.from(file.buffer);

    const upload = new Upload({
      client: this.s3Client,
      params: {
        Bucket: ConfigApp.aws_s3_bucket_name,
        Key: key,
        // Body: file.buffer,
        Body: stream,
        ContentType: file.mimetype,
      },
    });

    try {
      const data = await upload.done();
      return data.Location;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  async urlBuilders(filePath: string[]) {
    const filePaths = [];

    if (filePath.length != 0) {
      for (const iterator of filePath) {
        filePaths.push({
          file_path: iterator,
          full_url: `${ConfigApp.aws_s3_url}/${iterator}`,
        });
      }
    }
    return filePaths;
  }

  urlBuilder(filePath: string) {
    if (!filePath) {
      return null;
    }

    return {
      file_path: filePath,
      full_url: `${ConfigApp.aws_s3_url}/${filePath}`,
    };
  }
}
