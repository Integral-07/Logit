import { Hono } from 'hono'
import { Sql } from 'postgres'
import type {SupabaseClient} from '@supabase/supabase-js'
import { authMiddleware } from "./middleware/auth";
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { HTTPException } from 'hono/http-exception';
import { checkHealth } from './usecase/account';
import { databaseMiddleware } from './middleware/database';

interface Variables {
    supabase_auth_id: string;
    sql: Sql;
}

const createApp = (sql?: Sql, supabaseClient?: SupabaseClient) =>
  new Hono<{ Variables: Variables }>()
  // request logger
  .use("*", logger())

  // CORS middleware
  .use("*",
    cors({
      origin: [
        'http://localhost:3000',
        'https://app.logit.dev'
      ]
    })
  )

  // authentication middleware
  .use("/account/*", authMiddleware(supabaseClient))

  // database middleware
  .use("*", databaseMiddleware(sql))

  // error handling
  .onError((err, c) => {
    console.error(err);
    if (err instanceof HTTPException) {
      return err.getResponse();
    }

    return c.json(
      {
        error: {
          message: err.message,
        },
      },
      { status : 500 },
    );
  })

  // health check endpoint
  .get("/", async (c) => {
    const sql = c.get("sql");
    await checkHealth(sql);

    return c.text("logit API is running");
  });


const app = createApp();
export default app;