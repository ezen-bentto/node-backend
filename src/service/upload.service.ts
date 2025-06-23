// src/service/upload.service.ts
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { ENV } from '@/config/env.config';

const s3 = new S3Client({
  region: ENV.aws.region!,
  credentials: {
    accessKeyId: ENV.aws.accessKeyId!,
    secretAccessKey: ENV.aws.secretAccessKey!,
  },
});

export const UploadService = {
  uploadImageToS3: async (file: Express.Multer.File): Promise<string> => {
    const ext = path.extname(file.originalname);
    const key = `uploads/${uuidv4()}${ext}`;

    const command = new PutObjectCommand({
      Bucket: ENV.aws.bucket!,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await s3.send(command);

    return `https://${ENV.aws.bucket}.s3.${ENV.aws.region}.amazonaws.com/${key}`;
  },
};
