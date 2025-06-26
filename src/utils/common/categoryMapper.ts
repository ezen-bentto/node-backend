// utils/categoryMapper.ts

/**
 * 공모전 카테고리 문자열을 DB에서 사용하는 카테고리 ID로 매핑합니다.
 * 매칭되지 않는 경우 null 반환
 */
export const mapCategoryStringToId = (category: string): string | null => {
  const categoryMap: Record<string, string> = {
    '포스터/웹툰/콘텐츠': '1',
    '사진/영상/UCC': '2',
    '기획/아이디어': '3',
    'IT/학술/논문': '4',
    '네이밍/슬로건': '5',
    '스포츠/음악': '6',
    '미술/디자인/건축': '7',
  };

  return categoryMap[category] ?? null;
};
