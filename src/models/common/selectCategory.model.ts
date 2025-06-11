import { getDBConnection } from "@/config/db.config";
import logger from "@/utils/common/logger";

interface CategoryRow {
  category_id: number;
  name: string;
  reg_date: string;
  mod_date: string;
  del_yn: string;
}

interface CategoryResult {
  list: CategoryRow[];
}

export const selectCategory = async (): Promise<CategoryResult> => {
  const listSql = `
    SELECT 
      category_id,
      name,
      reg_date,
      mod_date,
      del_yn
    FROM category
    WHERE del_yn = 'N'
    ORDER BY category_id ASC
  `;

  try {
    const db = getDBConnection();

    // execute 대신 query 사용하고, [rows] 구조분해 하지 않음
    const result = await db.query(listSql);
    const list = Array.isArray(result) ? result : [];

    console.log("query로 가져온 result:", result);
    console.log("list 배열 여부:", Array.isArray(list));
    console.log("list 길이:", list.length);

    logger.info("카테고리 목록 조회 완료");

    return {
      list: list as CategoryRow[],
    };
  } catch (error) {
    logger.error("selectCategory 에러 발생", error);
    return { list: [] };
  }
};
export type { CategoryResult };
export default selectCategory;
