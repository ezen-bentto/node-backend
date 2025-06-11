import { getDBConnection } from "@/config/db.config";

export const deleteRecruitmentDetail = async (
  communityId: number,
): Promise<void> => {

  const db = getDBConnection();

  await db.query(
    `UPDATE 
      recruitment_detail
     SET
      del_yn = 'Y',
      mod_date = NOW() 
    WHERE 
    community_id = ?`,
    [communityId]
  );

};

export default deleteRecruitmentDetail;
