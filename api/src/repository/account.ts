import { Sql } from "postgres";

import type {
    Account,
}
from "../types/account";

interface AccountRow {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    created_at: Date;
    updated_at: Date;
}

const toAccount = (row: AccountRow): Account => ({
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
});

export async function healthCheckDb(sql: Sql): Promise<void> {
    await sql<readonly { "?column?": number }[]>`SELECT 1`;
}