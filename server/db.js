import pg from "pg";
const { Pool } = pg;

export const pool = new Pool({
    user: 'postgres',
    password: 'pass',
    host:'localhost',
    port: 5432,
    database: 'socialdb'
});