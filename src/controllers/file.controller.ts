import { Request, Response, NextFunction } from 'express';
import { modFile } from "./file/modFile.controller";
import { regFile } from "./file/regFile.controller";
import { updateImageReferences } from "./file/updateReferences.controller";
import { FileService } from "@/service/file.service";

/**
 *
 * 파일 컨트롤러 모음.
 *
 * @function fileController
 * @date 2025/06/27
 * @history
 * -------------------------------------------------------
 *           변경일             작성자             변경내용
 * -------------------------------------------------------
 *
 *        2025/06/27           한유리              신규작성
 * @param 없음
 */

// 파일을 조회하여 클라이언트로 전송하는 핸들러
const viewFile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { reference_type, reference_id } = req.params;
        const file = await FileService.getFileByReference(Number(reference_id), Number(reference_type));
        
        // mime_type이 null일 경우를 대비하여 기본값 설정
        const contentType = file.mime_type || 'application/octet-stream';
        
        // 응답 헤더에 Content-Type을 설정하고, 이미지 데이터(버퍼)를 전송
        res.setHeader('Content-Type', contentType);
        res.send(file.file_path);
    } catch (error) {
        next(error);
    }
};

export const fileController = {
  regFile,
  updateImageReferences,
  modFile,
  viewFile,
};