// src/utils/mapper.ts

import { User, AuthUser } from '../types/auth.type';

export const mapDbProviderToService = (dbProvider?: User['provider']): AuthUser['provider'] => {
  if (!dbProvider) return 'email'; // 기본값 (null 또는 undefined 처리)
  switch (dbProvider) {
    case '1': return 'kakao';
    case '2': return 'naver';
    case '3': return 'google';
    case '4': return 'email';
    default: return 'email';
  }
};

export const mapDbUserTypeToService = (dbUserType?: User['user_type']): AuthUser['userType'] => {
  if (!dbUserType) return undefined; // undefined 처리
  switch (dbUserType) {
    case '1': return '개인';
    case '2': return '기업';
    case '3': return '관리자';
    default: return undefined;
  }
};

export const mapDbApprovalStatusToService = (dbStatus?: User['approval_status']): AuthUser['approvalStatus'] => {
  if (!dbStatus) return undefined; // undefined 처리
  switch (dbStatus) {
    case '1': return '대기';
    case '2': return '승인';
    case '3': return '거절';
    default: return undefined;
  }
};