// src/models/auth/auth.model.ts
import mariadb from 'mariadb';
import { ENV } from '../../config/env.config';
import { SocialUser } from '../../types/auth.type';
import { User } from '../../types/auth.type';
import bcrypt from 'bcrypt';

export class AuthModel {
  private pool: mariadb.Pool;

  constructor() {
    this.pool = mariadb.createPool(ENV.db);
  }

  // user_type.type 값으로 user_type_id를 가져오는 헬퍼 함수
  private async getUserTypeId(type: '개인' | '기업' | '관리자'): Promise<number> {
    let conn: mariadb.PoolConnection | undefined;
    try {
      conn = await this.pool.getConnection();
      const rows = await conn.query(`SELECT user_id FROM user_type WHERE type = ?`, [type]);
      if (rows.length === 0) {
        throw new Error(`User type '${type}' not found.`);
      }
      return rows[0].user_id; // user_type 테이블의 PK가 user_id로 되어있어 이렇게 매핑
    } finally {
      if (conn) conn.release();
    }
  }

  // approval_status.status 값으로 approval_status_id를 가져오는 헬퍼 함수
  private async getApprovalStatusId(status: '대기' | '승인' | '반려' | '취소'): Promise<number> {
    let conn: mariadb.PoolConnection | undefined;
    try {
      conn = await this.pool.getConnection();
      const rows = await conn.query(`SELECT user_id FROM approval_status WHERE approval_status = ?`, [status]);
      if (rows.length === 0) {
        throw new Error(`Approval status '${status}' not found.`);
      }
      return rows[0].user_id; // approval_status 테이블의 PK가 user_id로 되어있어 이렇게 매핑
    } finally {
      if (conn) conn.release();
    }
  }


  // 소셜 ID (login_id)로 사용자 찾기
  async findUserBySocialId(socialId: string): Promise<User | undefined> {
    let conn: mariadb.PoolConnection | undefined;
    try {
      conn = await this.pool.getConnection();
      // user_type과 approval_status 정보를 함께 가져오도록 JOIN 쿼리 사용
      const rows = await conn.query(
        `SELECT
           u.user_id, u.login_id, u.nickname, u.password, u.phone, u.reg_date, u.mod_date, u.del_yn, u.email, u.profile_image,
           ut.type AS user_type,
           aps.approval_status AS approval_status
         FROM user u
         JOIN user_type ut ON u.user_id = ut.user_id -- user_id로 조인 (user_type 테이블 PK가 user_id라고 가정)
         LEFT JOIN approval_status aps ON u.user_id = aps.user_id -- user_id로 조인
         WHERE u.login_id = ?`,
        [socialId]
      );
      return rows[0];
    } catch (error) {
      console.error('findUserBySocialId 사용자 조회 실패:', error);
      throw error;
    } finally {
      if (conn) conn.release();
    }
  }

  // 이메일 (login_id)로 사용자 찾기 (기업회원용)
  async findUserByEmail(email: string): Promise<User | undefined> {
    let conn: mariadb.PoolConnection | undefined;
    try {
      conn = await this.pool.getConnection();
      const rows = await conn.query(
        `SELECT
           u.user_id, u.login_id, u.nickname, u.password, u.phone, u.reg_date, u.mod_date, u.del_yn, u.email, u.profile_image,
           ut.type AS user_type,
           aps.approval_status AS approval_status
         FROM user u
         JOIN user_type ut ON u.user_id = ut.user_id
         LEFT JOIN approval_status aps ON u.user_id = aps.user_id
         WHERE u.login_id = ? AND ut.type = '기업'`, // login_id가 이메일이고, user_type이 '기업'인 경우
        [email]
      );
      return rows[0];
    } catch (error) {
      console.error('findUserByEmail 사용자 조회 실패:', error);
      throw error;
    } finally {
      if (conn) conn.release();
    }
  }

  // user_id로 사용자 찾기
  async findUserById(userId: number): Promise<User | undefined> {
    let conn: mariadb.PoolConnection | undefined;
    try {
      conn = await this.pool.getConnection();
      const rows = await conn.query(
        `SELECT
           u.user_id, u.login_id, u.nickname, u.password, u.phone, u.reg_date, u.mod_date, u.del_yn, u.email, u.profile_image,
           ut.type AS user_type,
           aps.approval_status AS approval_status
         FROM user u
         JOIN user_type ut ON u.user_id = ut.user_id
         LEFT JOIN approval_status aps ON u.user_id = aps.user_id
         WHERE u.user_id = ?`,
        [userId]
      );
      return rows[0];
    } catch (error) {
      console.error('findUserById 사용자 조회 실패:', error);
      throw error;
    } finally {
      if (conn) conn.release();
    }
  }

  // 새 소셜 사용자 생성 (user_type: 개인, approval_status: 해당 없음)
  async createSocialUser(socialUser: SocialUser): Promise<number> {
    let conn: mariadb.PoolConnection | undefined;
    try {
      conn = await this.pool.getConnection();
      await conn.beginTransaction(); // 트랜잭션 시작

      // 1. user 테이블에 삽입
      const userResult = await conn.query(
        `INSERT INTO user (login_id, nickname, email, profile_image, reg_date, mod_date, del_yn)
         VALUES (?, ?, ?, ?, NOW(), NOW(), 'N')`,
        [
          socialUser.socialId, // login_id는 socialId
          socialUser.nickname,
          socialUser.email,
          socialUser.profileImage,
        ]
      );
      const newUserId: number = userResult.insertId;

      // 2. user_type 테이블에 '개인' 타입 연결
      const personalUserTypeId = await this.getUserTypeId('개인'); // '개인'은 DB에 1로 매핑되어있다고 가정.
      await conn.query(
        `INSERT INTO user_type (user_id, type, reg_date, mod_date, del_yn) VALUES (?, ?, NOW(), NOW(), 'N')`,
        [newUserId, personalUserTypeId] // user_type 테이블의 'type' 컬럼은 텍스트 값, 'user_id'는 FK를 가정.
      );

      // 소셜 로그인은 approval_status 테이블과 관련 없다고 가정하고 삽입하지 않음.
      // 만약 소셜 로그인도 승인 상태가 필요하다면 여기에 추가

      await conn.commit(); // 트랜잭션 커밋
      return newUserId;
    } catch (error) {
      await conn?.rollback(); // 오류 발생 시 롤백
      console.error('createSocialUser 사용자 생성 실패:', error);
      throw error;
    } finally {
      if (conn) conn.release();
    }
  }

  // 기업 사용자 생성 (user_type: 기업, approval_status: 대기)
  async createCompanyUser(companyData: { email: string; password: string; companyName: string; phoneNumber: string }): Promise<number> {
    let conn: mariadb.PoolConnection | undefined;
    try {
      conn = await this.pool.getConnection();
      await conn.beginTransaction(); // 트랜잭션 시작

      const hashedPassword = await bcrypt.hash(companyData.password, 10);

      // 1. user 테이블에 삽입
      const userResult = await conn.query(
        `INSERT INTO user (login_id, nickname, password, phone, email, reg_date, mod_date, del_yn)
         VALUES (?, ?, ?, ?, ?, NOW(), NOW(), 'N')`,
        [
          companyData.email, // login_id는 기업회원의 이메일
          companyData.companyName, // nickname은 회사명
          hashedPassword,
          companyData.phoneNumber,
          companyData.email, // email도 동일하게 이메일
        ]
      );
      const newUserId: number = userResult.insertId;

      // 2. user_type 테이블에 '기업' 타입 연결
      const companyUserTypeId = await this.getUserTypeId('기업');
      await conn.query(
        `INSERT INTO user_type (user_id, type, reg_date, mod_date, del_yn) VALUES (?, ?, NOW(), NOW(), 'N')`,
        [newUserId, companyUserTypeId]
      );

      // 3. approval_status 테이블에 '대기' 상태 연결
      const pendingApprovalStatusId = await this.getApprovalStatusId('대기');
      await conn.query(
        `INSERT INTO approval_status (user_id, approval_status, reg_date, mod_date, del_yn) VALUES (?, ?, NOW(), NOW(), 'N')`,
        [newUserId, pendingApprovalStatusId]
      );

      await conn.commit(); // 트랜잭션 커밋
      return newUserId;
    } catch (error) {
      await conn?.rollback(); // 오류 발생 시 롤백
      console.error('createCompanyUser 기업 사용자 생성 실패:', error);
      throw error;
    } finally {
      if (conn) conn.release();
    }
  }

  // 소셜 사용자 정보 업데이트 (nickname, profileImage만)
  async updateSocialUser(userId: number, socialUser: Partial<SocialUser>): Promise<boolean> {
    let conn: mariadb.PoolConnection | undefined;
    try {
      conn = await this.pool.getConnection();
      const result = await conn.query(
        `UPDATE user SET nickname = ?, profile_image = ?, mod_date = NOW() WHERE user_id = ?`,
        [socialUser.nickname, socialUser.profileImage, userId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('updateSocialUser 사용자 정보 업데이트 실패:', error);
      throw error;
    } finally {
      if (conn) conn.release();
    }
  }

  // Refresh Token 저장 또는 업데이트 (refresh_tokens 테이블 사용)
  async saveRefreshToken(userId: number, token: string, expDate: Date): Promise<void> {
    let conn: mariadb.PoolConnection | undefined;
    try {
      conn = await this.pool.getConnection();
      // user_id에 해당하는 기존 Refresh Token이 있는지 확인
      const existingToken = await conn.query(
        `SELECT refresh_id FROM refresh_tokens WHERE user_id = ? AND del_yn = 'N'`,
        [userId]
      );

      if (existingToken.length > 0) {
        // 기존 토큰이 있으면 업데이트
        await conn.query(
          `UPDATE refresh_tokens SET token = ?, exp_date = ?, mod_date = NOW() WHERE user_id = ?`,
          [token, expDate, userId]
        );
      } else {
        // 없으면 삽입
        await conn.query(
          `INSERT INTO refresh_tokens (user_id, token, exp_date, reg_date, mod_date, del_yn) VALUES (?, ?, ?, NOW(), NOW(), 'N')`,
          [userId, token, expDate]
        );
      }
    } catch (error) {
      console.error('saveRefreshToken Refresh Token 저장/업데이트 실패:', error);
      throw error;
    } finally {
      if (conn) conn.release();
    }
  }

  // Refresh Token 조회
  async findRefreshTokenByToken(token: string): Promise<{ refresh_id: number; user_id: number; token: string; exp_date: Date } | undefined> {
    let conn: mariadb.PoolConnection | undefined;
    try {
      conn = await this.pool.getConnection();
      const rows = await conn.query(
        `SELECT refresh_id, user_id, token, exp_date FROM refresh_tokens WHERE token = ? AND del_yn = 'N'`,
        [token]
      );
      return rows[0];
    } catch (error) {
      console.error('findRefreshTokenByToken Refresh Token 조회 실패:', error);
      throw error;
    } finally {
      if (conn) conn.release();
    }
  }

  // Refresh Token 삭제 (del_yn을 'Y'로 업데이트)
  async deleteRefreshToken(token: string): Promise<boolean> {
    let conn: mariadb.PoolConnection | undefined;
    try {
      conn = await this.pool.getConnection();
      const result = await conn.query(
        `UPDATE refresh_tokens SET del_yn = 'Y', mod_date = NOW() WHERE token = ?`,
        [token]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('deleteRefreshToken Refresh Token 삭제 실패:', error);
      throw error;
    } finally {
      if (conn) conn.release();
    }
  }
}