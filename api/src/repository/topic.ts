import type { Sql } from "postgres";
import type { Topic } from "../types/topic";

interface TopicRow {

  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

const toTopic = (row: TopicRow): Topic => {

    return {
        id: row.id,
        name: row.name,
        description: row.description ?? undefined,
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at),
    };
};

const ensureSingle = <T>(rows: T[]): T|null => {

    if (rows.length === 0) {
        return null;
    }

    if (rows.length > 1) {
        throw new Error("Expected single row");
    }

    return rows[0];
};


export async function createTopic(sql: Sql, name: string, description?: string): Promise<number> {

    const rows = await sql`
        INSERT INTO topics (name, description)
        VALUES (${name}, ${description ?? null})
        RETURNING id
    `;

    return rows[0].id;
}

export async function getTalentByOwnerId(sql: Sql, ownerId: number): Promise<Topic[] > {

    const rows = await sql<TopicRow[]>`
        SELECT id, name, description, created_at, updated_at
        FROM topics
        WHERE owner_id = ${ownerId}
    `;

    return rows.map(toTopic);
}