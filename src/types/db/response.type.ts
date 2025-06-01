export interface InsertResult {
  affectedRows: number;
  insertId: number | bigint;
  warningStatus: number;
}

export interface UpdateResult {
  affectedRows: number;
  //changedRows?: number; // 드라이버에 따라 제공 가능
  warningStatus: number;
}

export interface DeleteResult {
  affectedRows: number;
  warningStatus: number;
}
