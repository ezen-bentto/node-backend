import mariadb  from "mariadb";
import { ENV } from "./env.config";

let pool: mariadb.Pool;

export const getDBConnection = () => {
  if (!pool) {
    pool = mariadb.createPool(ENV.db);
  }
  return pool;
};