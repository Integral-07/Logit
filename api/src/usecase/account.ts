import type { Sql } from "postgres";

/**
 * データベース接続の健全性をチェック
 */
export const checkHealth = async (sql: Sql): Promise<void> => {
  // 簡単なクエリを実行してデータベース接続を確認
  await sql`SELECT 1`;
};
