import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
const connectionString = process.env.DATABASE_URL;
export const hasDatabaseUrl = () => {
    return Boolean(connectionString);
};
declare global {
    var articlePostgresClient: postgres.Sql | undefined;
}
const createClient = () => {
    if (!connectionString) {
        throw new Error("DATABASE_URL is not set.");
    }
    return postgres(connectionString, {
        prepare: false,
    });
};
const client = connectionString
    ? globalThis.articlePostgresClient ?? (globalThis.articlePostgresClient = createClient())
    : undefined;
export const db = client ? drizzle(client, { schema }) : undefined;
