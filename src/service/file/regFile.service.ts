import { ContestModel } from '@/models/contest.model';
import { handleDbError } from '@/utils/handleDbError';
import fs from 'fs';
import { buffer } from 'stream/consumers';

/**
 *
 * 파일 등록 서비스
 *
 * 클라이언트로부터 전달받은 파일 정보를
 * 데이터베이스에 저장하고, 저장 결과를 반환합니다.
 *
 * @function regContest
 * @date 2025/06/27
 * @history
 * -------------------------------------------------------
 *           변경일             작성자             변경내용
 * -------------------------------------------------------
 *
 *        2025/06/27           한유리             신규작성
 * @param data - 공모전 등록에 필요한 데이터 객체
 */

// zod 만들거니까 필요 없음
export interface FileParams {
  reference_id: number;
  reference_type: number;
  original_name: string;
  file_path: Buffer;
}

export const regFile = async (data: FileParams) => {
    try{
        // 버퍼 검증
        if(!data.file_path || data.file_path.length === 0){
            throw new Error('빈 파일입니다');
        }

        const res = await ContestModel.regFile(data);
        return res;
    }catch (err: unknown) {
        handleDbError(err);
        throw err;
    }
}