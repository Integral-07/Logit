import { env } from "hono/adapter";
import { createMiddleware } from "hono/factory";
import type { Sql } from "postgres";
import postgres from "postgres";

export const databaseMiddleware = (sql?: Sql) =>
  createMiddleware(async (c, next) => {
    if (sql) {
      c.set("sql", sql);
    } else {
      const { HYPERDRIVE, DATABASE_URL } = env<{
        HYPERDRIVE?: { connectionString?: string };
        DATABASE_URL?: string;
      }>(c);
      const databaseUrl = HYPERDRIVE?.connectionString ?? DATABASE_URL;
      if (!databaseUrl) {
        throw new Error("環境変数に DATABASE_URL が設定されていません。");
      }
      const sql = postgres(
        databaseUrl,
        databaseUrl.includes(".supabase.com") ? { ssl: "require" } : {},
      );
      c.set("sql", sql);
    }
    await next();
  });