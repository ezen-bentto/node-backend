// src/models/auth/auth.model.ts

import { getDBConnection } from '../../config/db.config';
import { SocialUser, User } from '../../types/auth.type';
import bcrypt from 'bcrypt';
import mariadb from 'mariadb';

export class AuthModel {
    async findUserBySocialId(socialId: string): Promise<User | undefined> {
        let conn: mariadb.PoolConnection | undefined;
        try {
            conn = await getDBConnection().getConnection();
            const rows = await conn.query(
                `SELECT 
                    u.user_id, u.login_id, u.nickname, u.password, u.phone, u.reg_date, u.mod_date, u.del_yn, u.email, u.profile_image,
                    u.user_type,
                    aps.approval_status
                 FROM user u
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
                    u.user_type,
                    aps.approval_status
                 FROM user u
                 LEFT JOIN approval_status aps ON u.user_id = aps.user_id
                 WHERE u.email = ?`,
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
                    u.user_type,
                    aps.approval_status
                 FROM user u
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
            const userResult = await conn.query(
                `INSERT INTO user (login_id, nickname, email, profile_image, user_type)
                 VALUES (?, ?, ?, ?, '1')`,
                [socialUser.socialId, socialUser.nickname, socialUser.email, socialUser.profileImage]
            );
            return userResult.insertId;
        } catch (error) {
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
            await conn.beginTransaction(); // 트랜잭션 시작

            const hashedPassword = await bcrypt.hash(companyData.password, 10);
            
            const userResult = await conn.query(
                `INSERT INTO user (login_id, nickname, password, phone, email, user_type)
                 VALUES (?, ?, ?, ?, ?, '2')`,
                [
                    companyData.email,
                    companyData.companyName,
                    hashedPassword,
                    companyData.phoneNumber,
                    companyData.email,
                ]
            );
            const newUserId: number = userResult.insertId;

            // approval_status 테이블에 '대기' 상태('1')로 추가
            await conn.query(
                `INSERT INTO approval_status (user_id, approval_status) VALUES (?, '1')`,
                [newUserId]
            );

            await conn.commit(); // 트랜잭션 성공 (커밋)
            return newUserId;
        } catch (error) {
            await conn?.rollback(); // 에러 발생 시 롤백
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
            await conn.query(
                `INSERT INTO refresh_tokens (user_id, token, exp_date) VALUES (?, ?, ?)
                 ON DUPLICATE KEY UPDATE token = VALUES(token), exp_date = VALUES(exp_date), del_yn = 'N', mod_date = NOW()`,
                [userId, token, expDate]
            );
        } catch (error) {
            console.error('saveRefreshToken 실패:', error);
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
            console.error('findRefreshTokenByToken 실패:', error);
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
            console.error('deleteRefreshToken 실패:', error);
            throw error;
        } finally {
            if (conn) conn.release();
        }
    }
}