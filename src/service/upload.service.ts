// src/service/upload.service.ts
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { ENV } from '@/config/env.config';
import sharp from 'sharp';

const s3 = new S3Client({
  region: ENV.aws.region!,
  credentials: {
    accessKeyId: ENV.aws.accessKeyId!,
    secretAccessKey: ENV.aws.secretAccessKey!,
  },
});

export const UploadService = {
  uploadImageToS3: async (file: Express.Multer.File): Promise<string> => {
    const ext = path.extname(file.originalname).toLowerCase();
    const isImage = ['.jpg', '.jpeg', '.png', '.webp'].includes(ext);

    if (!isImage) {
      throw new Error('지원하지 않는 이미지 형식입니다.');
    }

    // ✅ sharp 적용: 800px 리사이즈, WebP 변환, 압축
    const optimizedBuffer = await sharp(file.buffer)
      .resize({ width: 800, withoutEnlargement: true }) // 원본보다 크면 그대로
      .webp({ quality: 75 }) // WebP 압축 품질 설정
      .toBuffer();

    const key = `uploads/${uuidv4()}.webp`;

    const command = new PutObjectCommand({
      Bucket: ENV.aws.bucket!,
      Key: key,
      Body: optimizedBuffer,
      ContentType: 'image/webp',
    });

    await s3.send(command);

    return `https://${ENV.aws.bucket}.s3.${ENV.aws.region}.amazonaws.com/${key}`;
  },
};
