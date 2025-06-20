// src/models/auth/auth.model.ts
import { getDBConnection } from '../../config/db.config';
import { ENV } from '../../config/env.config';
import { SocialUser } from '../../types/auth.type';
import { User } from '../../types/auth.type';
import bcrypt from 'bcrypt';
import mariadb from 'mariadb';

export class AuthModel {
  // user_type.type 값으로 user_type_id를 가져오는 헬퍼 함수
  private async getUserTypeId(type: '개인' | '기업' | '관리자'): Promise<number> {
    let conn: mariadb.PoolConnection | undefined;
    try {
      conn = await getDBConnection().getConnection();
      const rows = await conn.query(`SELECT user_id FROM user_type WHERE type = ?`, [type]);
      if (rows.length === 0) {
        throw new Error(`User type '${type}' not found.`);
      }
      return rows[0].user_id;
    } finally {
      if (conn) conn.release();
    }
  }

  // approval_status.status 값으로 approval_status_id를 가져오는 헬퍼 함수
  private async getApprovalStatusId(status: '대기' | '승인' | '반려' | '취소'): Promise<number> {
    let conn: mariadb.PoolConnection | undefined;
    try {
      conn = await getDBConnection().getConnection();
      const rows = await conn.query(
        `SELECT user_id FROM approval_status WHERE approval_status = ?`,
        [status]
      );
      if (rows.length === 0) {
        throw new Error(`Approval status '${status}' not found.`);
      }
      return rows[0].user_id;
    } finally {
      if (conn) conn.release();
    }
  }

  async findUserBySocialId(socialId: string): Promise<User | undefined> {
    let conn: mariadb.PoolConnection | undefined;
    try {
      conn = await getDBConnection().getConnection();
      const rows = await conn.query(
        `SELECT
           u.user_id, u.login_id, u.nickname, u.password, u.phone, u.reg_date, u.mod_date, u.del_yn, u.email, u.profile_image,
           ut.type AS user_type,
           aps.approval_status AS approval_status
         FROM user u
         JOIN user_type ut ON u.user_id = ut.user_id
         LEFT JOIN approval_status aps ON u.user_id = aps.user_id
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

  async findUserByEmail(email: string): Promise<User | undefined> {
    let conn: mariadb.PoolConnection | undefined;
    try {
      conn = await getDBConnection().getConnection();
      const rows = await conn.query(
        `SELECT
           u.user_id, u.login_id, u.nickname, u.password, u.phone, u.reg_date, u.mod_date, u.del_yn, u.email, u.profile_image,
           ut.type AS user_type,
           aps.approval_status AS approval_status
         FROM user u
         JOIN user_type ut ON u.user_id = ut.user_id
         LEFT JOIN approval_status aps ON u.user_id = aps.user_id
         WHERE u.login_id = ? AND ut.type = '기업'`,
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

  async findUserById(userId: number): Promise<User | undefined> {
    let conn: mariadb.PoolConnection | undefined;
    try {
      conn = await getDBConnection().getConnection();
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

  async createSocialUser(socialUser: SocialUser): Promise<number> {
    let conn: mariadb.PoolConnection | undefined;
    try {
      conn = await getDBConnection().getConnection();
      await conn.beginTransaction();

      const userResult = await conn.query(
        `INSERT INTO user (login_id, nickname, email, profile_image, reg_date, mod_date, del_yn)
         VALUES (?, ?, ?, ?, NOW(), NOW(), 'N')`,
        [socialUser.socialId, socialUser.nickname, socialUser.email, socialUser.profileImage]
      );
      const newUserId: number = userResult.insertId;

      const personalUserTypeId = await this.getUserTypeId('개인');
      await conn.query(
        `INSERT INTO user_type (user_id, type, reg_date, mod_date, del_yn) VALUES (?, ?, NOW(), NOW(), 'N')`,
        [newUserId, personalUserTypeId]
      );

      await conn.commit();
      return newUserId;
    } catch (error) {
      await conn?.rollback();
      console.error('createSocialUser 사용자 생성 실패:', error);
      throw error;
    } finally {
      if (conn) conn.release();
    }
  }

  async createCompanyUser(companyData: {
    email: string;
    password: string;
    companyName: string;
    phoneNumber: string;
  }): Promise<number> {
    let conn: mariadb.PoolConnection | undefined;
    try {
      conn = await getDBConnection().getConnection();
      await conn.beginTransaction();

      const hashedPassword = await bcrypt.hash(companyData.password, 10);

      const userResult = await conn.query(
        `INSERT INTO user (login_id, nickname, password, phone, email, reg_date, mod_date, del_yn)
         VALUES (?, ?, ?, ?, ?, NOW(), NOW(), 'N')`,
        [
          companyData.email,
          companyData.companyName,
          hashedPassword,
          companyData.phoneNumber,
          companyData.email,
        ]
      );
      const newUserId: number = userResult.insertId;

      const companyUserTypeId = await this.getUserTypeId('기업');
      await conn.query(
        `INSERT INTO user_type (user_id, type, reg_date, mod_date, del_yn) VALUES (?, ?, NOW(), NOW(), 'N')`,
        [newUserId, companyUserTypeId]
      );

      const pendingApprovalStatusId = await this.getApprovalStatusId('대기');
      await conn.query(
        `INSERT INTO approval_status (user_id, approval_status, reg_date, mod_date, del_yn) VALUES (?, ?, NOW(), NOW(), 'N')`,
        [newUserId, pendingApprovalStatusId]
      );

      await conn.commit();
      return newUserId;
    } catch (error) {
      await conn?.rollback();
      console.error('createCompanyUser 기업 사용자 생성 실패:', error);
      throw error;
    } finally {
      if (conn) conn.release();
    }
  }

  async updateSocialUser(userId: number, socialUser: Partial<SocialUser>): Promise<boolean> {
    let conn: mariadb.PoolConnection | undefined;
    try {
      conn = await getDBConnection().getConnection();
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

  async saveRefreshToken(userId: number, token: string, expDate: Date): Promise<void> {
    let conn: mariadb.PoolConnection | undefined;
    try {
      conn = await getDBConnection().getConnection();
      const existingToken = await conn.query(
        `SELECT refresh_id FROM refresh_tokens WHERE user_id = ? AND del_yn = 'N'`,
        [userId]
      );

      if (existingToken.length > 0) {
        await conn.query(
          `UPDATE refresh_tokens SET token = ?, exp_date = ?, mod_date = NOW() WHERE user_id = ?`,
          [token, expDate, userId]
        );
      } else {
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

  async findRefreshTokenByToken(
    token: string
  ): Promise<{ refresh_id: number; user_id: number; token: string; exp_date: Date } | undefined> {
    let conn: mariadb.PoolConnection | undefined;
    try {
      conn = await getDBConnection().getConnection();
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

  async deleteRefreshToken(token: string): Promise<boolean> {
    let conn: mariadb.PoolConnection | undefined;
    try {
      conn = await getDBConnection().getConnection();
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
