import { env } from 'node:process';
import app from './app';

const PORT = env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server is listening on port : ${PORT}`);
  console.log('🚀 Jenkins 자동 배포 테스트용 로그!');
  console.log('🚀 Jenkins 인바운드 규칙 변경 후 테스트!');
  console.log('🚀 Jenkins ENDSSH 수정 후 테스트');
  console.log('🚀 EC2 GITHUB WOOKS IP 등록 후 테스트');
  console.log('🚀 SSH KEY 오류 수정 후 테스트');
  console.log('🚀 SSH KEY 오류 수정 후 테스트2');
  console.log('🚀 jenkins 파일 분리 후 테스트');
  console.log('🚀 jenkins 파일 분리 후 테스트2');
});
