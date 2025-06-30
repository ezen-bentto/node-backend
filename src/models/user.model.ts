import { getDBConnection } from '@/config/db.config';
import { User, UpdateProfileData } from '@/types/auth.type'; 

/**
 * 이메일로 사용자를 찾습니다.
 */
export const findByEmail = async (email: string): Promise<User | null> => {
    const conn = await getDBConnection().getConnection();
    try {
        const sql = `SELECT * FROM user WHERE email = ? AND del_yn = 'N'`;
        const rows = await conn.query<User[]>(sql, [email]);
        return rows.length > 0 ? rows[0] : null;
    } finally {
        if (conn) conn.release();
    }
};

/**
 * ID로 사용자를 찾습니다.
 */
export const findById = async (userId: number): Promise<User | null> => {
    const conn = await getDBConnection().getConnection();
    try {
        const sql = `SELECT * FROM user WHERE user_id = ? AND del_yn = 'N'`;
        const rows = await conn.query<User[]>(sql, [userId]);
        return rows.length > 0 ? rows[0] : null;
    } finally {
        if (conn) conn.release();
    }
};

/**
 * 사용자 프로필 정보를 업데이트합니다.
 */
export const updateProfile = async (userId: number, data: UpdateProfileData): Promise<any> => {
    const conn = await getDBConnection().getConnection();
    try {
        const fieldsToUpdate: string[] = [];
        const params: (string | number | null)[] = [];

        if (data.nickname) {
            fieldsToUpdate.push('nickname = ?');
            params.push(data.nickname);
        }
        if (data.email) {
            fieldsToUpdate.push('email = ?');
            params.push(data.email);
        }
        if (data.hasOwnProperty('profileImage')) {
            fieldsToUpdate.push('profile_image = ?');
            // data.profileImage가 undefined일 경우, null로 변환하여 push
            params.push(data.profileImage ?? null);
        }

        if (fieldsToUpdate.length === 0) return { affectedRows: 0 };
        
        const sql = `
            UPDATE user 
            SET ${fieldsToUpdate.join(', ')}, mod_date = NOW() 
            WHERE user_id = ?
        `;
        params.push(userId);

        console.log('Executing SQL:', sql, params);
        const result = await conn.query(sql, params);
        return result;
    } finally {
        if (conn) conn.release();
    }
};