import { get } from '@/controllers/demo/get.controller';
import { post } from '@/controllers/demo/post.controller';

import type { Request, Response } from 'express';  // 타입 전용 import


const DemoController = { get, post };

DemoController.get = (req: Request, res: Response): void => {
    console.log("성공");
    res.json({ message: 'GET request to /api/demo' });
}

export default DemoController;
