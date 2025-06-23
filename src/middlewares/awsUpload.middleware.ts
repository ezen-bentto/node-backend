import multer from 'multer';

const storage = multer.memoryStorage(); // S3 업로드 시 필요
export const upload = multer({ storage });
