import type { SupabaseClient } from "@supabase/supabase-js";
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import { auth } from "hono/utils/basic-auth";
import { getSupabase } from "../lib/supabase";

export const authMiddleware = (supabaseClient?: SupabaseClient) =>
    createMiddleware(async (c, next) => {

        const authHeader = c.req.header("Authorization");

        if(!authHeader?.startsWith("Bearer ")) {
            throw new HTTPException(401, { message: "Authorization header missing or malformed" });
        }

        const token = authHeader.replace("Bearer ", "");

        const supabase = supabaseClient ?? getSupabase();
        const {
            data: { user },
            error,
        } = await supabase.auth.getUser(token);

        if (error || !user) {
            throw new HTTPException(401, { message: "Invalid or expired token" });
        }

        c.set("supabase_auth_id", user.id);

        await next();
    });