import mariadb from 'mariadb';
import { ENV } from '../../config/env.config';
import { SocialUser } from '../../types/auth.type';

export class AuthModel {
  private pool: mariadb.Pool;

  constructor() {
    this.pool = mariadb.createPool(ENV.db);
  }

  // 소셜 ID로 사용자 찾기
  async findUserBySocialId(socialId: string, provider: string) {
    let conn: mariadb.PoolConnection | undefined;
    try {
      conn = await this.pool.getConnection();
      const rows = await conn.query(
        `SELECT * FROM users WHERE social_id = ? AND provider = ?`,
        [socialId, provider]
      );
      return rows[0];
    } catch (error) {
      console.error('사용자 조회 실패:', error);
      throw error;
    } finally {
      if (conn) conn.release();
    }
  }

  // 이메일로 사용자 찾기
  async findUserByEmail(email: string) {
    let conn: mariadb.PoolConnection | undefined;
    try {
      conn = await this.pool.getConnection();
      const rows = await conn.query(
        `SELECT * FROM users WHERE email = ?`,
        [email]
      );
      return rows[0];
    } catch (error) {
      console.error('사용자 조회 실패:', error);
      throw error;
    } finally {
      if (conn) conn.release();
    }
  }

  // 새 사용자 생성
  async createSocialUser(socialUser: SocialUser) {
    let conn: mariadb.PoolConnection | undefined;
    try {
      conn = await this.pool.getConnection();
      const result = await conn.query(
        `INSERT INTO users (social_id, email, nickname, profile_image, provider, created_at, updated_at) 
         VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          socialUser.socialId,
          socialUser.email,
          socialUser.nickname,
          socialUser.profileImage,
          socialUser.provider,
        ]
      );
      return result.insertId;
    } catch (error) {
      console.error('사용자 생성 실패:', error);
      throw error;
    } finally {
      if (conn) conn.release();
    }
  }

  // 사용자 정보 업데이트
  async updateSocialUser(userId: number, socialUser: Partial<SocialUser>) {
    let conn: mariadb.PoolConnection | undefined;
    try {
      conn = await this.pool.getConnection();
      const result = await conn.query(
        `UPDATE users SET nickname = ?, profile_image = ?, updated_at = NOW() 
         WHERE id = ?`,
        [socialUser.nickname, socialUser.profileImage, userId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('사용자 정보 업데이트 실패:', error);
      throw error;
    } finally {
      if (conn) conn.release();
    }
  }

  // ID로 사용자 조회
  async findUserById(userId: number) {
    let conn: mariadb.PoolConnection | undefined;
    try {
      conn = await this.pool.getConnection();
      const rows = await conn.query(
        `SELECT id, email, nickname, profile_image, provider FROM users WHERE id = ?`,
        [userId]
      );
      return rows[0];
    } catch (error) {
      console.error('사용자 조회 실패:', error);
      throw error;
    } finally {
      if (conn) conn.release();
    }
  }
}