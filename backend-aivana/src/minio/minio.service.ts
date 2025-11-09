import { Injectable, OnModuleInit } from '@nestjs/common';
import * as Minio from 'minio';
import { ConfigService } from '@nestjs/config';

interface UploadedFile {
  buffer: Buffer;
  mimetype: string;
  size: number;
  originalname: string;
}

@Injectable()
export class MinioService implements OnModuleInit {
  private minioClient: Minio.Client;
  private bucketName: string;

  private getRequired(key: string): string {
    const value = this.configService.get<string>(key);
    if (!value) {
      throw new Error(`Missing required configuration value: ${key}`);
    }
    return value;
  }

  constructor(private configService: ConfigService) {
    this.bucketName = this.getRequired('MINIO_BUCKET_NAME');

    const endpoint = this.getRequired('MINIO_ENDPOINT');
    const port = parseInt(this.getRequired('MINIO_PORT'), 10);
    const useSSL =
      (this.configService.get<string>('MINIO_USE_SSL') ?? 'false') === 'true';
    const accessKey = this.getRequired('MINIO_ACCESS_KEY');
    const secretKey = this.getRequired('MINIO_SECRET_KEY');

    this.minioClient = new Minio.Client({
      endPoint: endpoint,
      port,
      useSSL,
      accessKey,
      secretKey,
    });
  }

  async onModuleInit() {
    await this.createBucketIfNotExists();
  }

  private async createBucketIfNotExists() {
    try {
      const exists = await this.minioClient.bucketExists(this.bucketName);
      if (!exists) {
        await this.minioClient.makeBucket(this.bucketName, 'us-east-1');
        console.log(`Bucket ${this.bucketName} created successfully`);
      }

      // Set bucket policy to public read for e-commerce product images
      const publicReadPolicy = {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Principal: { AWS: ['*'] },
            Action: ['s3:GetObject'],
            Resource: [`arn:aws:s3:::${this.bucketName}/*`],
          },
        ],
      };

      await this.minioClient.setBucketPolicy(
        this.bucketName,
        JSON.stringify(publicReadPolicy),
      );
      console.log(`Bucket ${this.bucketName} set to public read access`);
    } catch (error) {
      console.error('Error creating bucket:', error);
    }
  }

  async uploadFile(
    file: UploadedFile,
    fileName: string,
    folder?: string,
  ): Promise<string> {
    try {
      const metaData = {
        'Content-Type': file.mimetype,
      };

      // Add folder prefix if provided
      const fullPath = folder ? `${folder}/${fileName}` : fileName;

      await this.minioClient.putObject(
        this.bucketName,
        fullPath,
        file.buffer,
        file.size,
        metaData,
      );

      return fullPath;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to upload file: ${message}`);
    }
  }

  getFileUrl(fileName: string): string {
    try {
      // Return permanent public URL for e-commerce
      const endpoint = this.configService.get<string>('MINIO_ENDPOINT');
      const port = this.configService.get<string>('MINIO_PORT');
      const useSSL =
        (this.configService.get<string>('MINIO_USE_SSL') ?? 'false') === 'true';

      const protocol = useSSL ? 'https' : 'http';
      const portSuffix =
        port && port !== '80' && port !== '443' ? `:${port}` : '';

      // Public URL format: http://localhost:9000/bucket-name/file-path
      const publicUrl = `${protocol}://${endpoint}${portSuffix}/${this.bucketName}/${fileName}`;

      return publicUrl;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to get file URL: ${message}`);
    }
  }

  async listFiles(): Promise<string[]> {
    try {
      const objectsStream = this.minioClient.listObjects(
        this.bucketName,
        '',
        true,
      );
      const files: string[] = [];

      return new Promise((resolve, reject) => {
        objectsStream.on('data', (obj) => {
          if (obj.name) {
            files.push(obj.name);
          }
        });
        objectsStream.on('end', () => resolve(files));
        objectsStream.on('error', reject);
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to list files: ${message}`);
    }
  }

  async deleteFile(fileName: string): Promise<void> {
    try {
      await this.minioClient.removeObject(this.bucketName, fileName);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to delete file: ${message}`);
    }
  }
}
