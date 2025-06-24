// src/models/auth/auth.model.ts

import { getDBConnection } from '../../config/db.config';
import { SocialUser, User } from '../../types/auth.type'; // AuthUser는 여기서 직접 사용되지 않으므로 제거 가능
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

    // userId는 현재 Number(payload.userId)로 들어오므로 number로 유지.
    // mariadb 드라이버가 bigint 컬럼에 number를 잘 매핑한다고 가정.
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
                [userId] // number를 그대로 전달
            );
            return rows[0];
        } catch (error) {
            console.error('findUserById 사용자 조회 실패:', error);
            throw error;
        } finally {
            if (conn) conn.release();
        }
    }

    // createSocialUser는 insertId가 number로 반환된다고 가정.
    async createSocialUser(socialUser: SocialUser): Promise<number> {
        let conn: mariadb.PoolConnection | undefined;
        try {
            conn = await getDBConnection().getConnection();
            const userResult = await conn.query(
                `INSERT INTO user (login_id, nickname, email, profile_image, user_type, login_type)
                 VALUES (?, ?, ?, ?, 1, 1)`, // user_type: 1(개인), login_type: 1(카카오)
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

    // createCompanyUser도 insertId가 number로 반환된다고 가정.
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
                `INSERT INTO user (login_id, nickname, password, phone, email, user_type, login_type)
                 VALUES (?, ?, ?, ?, ?, 2, 4)`, // user_type: 2(기업), login_type: 4(이메일)
                [
                    companyData.email,
                    companyData.companyName,
                    hashedPassword,
                    companyData.phoneNumber,
                    companyData.email,
                ]
            );
            const newUserId: number = userResult.insertId;

            await conn.query(
                `INSERT INTO approval_status (user_id, approval_status) VALUES (?, '2')`,
                [newUserId]
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

    // updateSocialUser의 userId 파라미터를 number로 유지
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

    // saveRefreshToken 메서드 수정:
    // 1. userId 파라미터 타입을 string으로 변경 (authUser.id가 string이므로)
    // 2. refresh_id를 number로 생성
    // 3. user_id 파라미터를 DB에 전달할 때 Number()로 변환 (타입 에러 방지)
    async saveRefreshToken(userId: string, token: string, expDate: Date): Promise<void> {
        let conn: mariadb.PoolConnection | undefined;
        try {
            conn = await getDBConnection().getConnection();
            
            // `refresh_id`는 `bigint(20)`이지만, Number()로 생성한 값을 넣습니다.
            // 이로 인해 발생할 수 있는 잠재적인 문제(정밀도 손실, 고유성 충돌)는 개발자가 인지해야 합니다.
            const refreshId = Date.now() + Math.floor(Math.random() * 1000); // number 타입 유지
            
            // `user_id`는 `bigint(20)`이지만, `AuthUser.id`가 `string`이므로 Number()로 변환하여 전달
            // mariadb 드라이버가 이 number 값을 bigint 컬럼에 잘 매핑한다고 가정
            const userIdAsNumber = Number(userId);

            await conn.query(
                `INSERT INTO refresh_tokens (refresh_id, user_id, token, exp_date, reg_date, del_yn) 
                 VALUES (?, ?, ?, ?, NOW(), 'N')
                 ON DUPLICATE KEY UPDATE 
                 token = VALUES(token), 
                 exp_date = VALUES(exp_date), 
                 del_yn = 'N', 
                 mod_date = NOW()`,
                [refreshId, userIdAsNumber, token, expDate]
            );
        } catch (error) {
            console.error('saveRefreshToken 실패:', error);
            throw error;
        } finally {
            if (conn) conn.release();
        }
    }

    // findRefreshTokenByToken 메서드의 반환 타입 수정:
    // refresh_id와 user_id는 DB에서 bigint로 오지만, number로 받는다고 가정.
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
            // mariadb 드라이버가 bigint를 number로 반환할 때의 잠재적 정밀도 손실 감수
            return rows[0] ? {
                refresh_id: rows[0].refresh_id, // number로 간주
                user_id: rows[0].user_id,     // number로 간주
                token: rows[0].token,
                exp_date: rows[0].exp_date
            } : undefined;
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