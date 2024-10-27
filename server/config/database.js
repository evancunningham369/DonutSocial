import * as dotenv from 'dotenv';

dotenv.config();

import pg from "pg";
import fs from 'fs';

const { Pool } = pg;

// Local Postgres configuration
export const pool = new Pool({
    user: 'postgres',
    password: 'pass',
    host:'localhost',
    port: 5432,
    database: 'socialdb'
});

//Azure Postgres configuration
//
// export const pool = new Pool({host:process.env.psqlHost,
//      user:process.env.psqlUser, 
//      password:process.env.psqlPass, 
//      database:process.env.psqlDatabase, 
//      port:5432, 
//      ssl:{
//         rejectUnauthorized: false,
//         ca:fs.readFileSync(process.env.psqlCertPath).toString()}
//     });

console.log('Database connection successful');

const createDatabaseAndTables = async () => {
    try {
        //Create database
        const client = await pool.connect();

        //Create account table
        await client.query(`
            CREATE TABLE IF NOT EXISTS account(
                user_id SERIAL PRIMARY KEY,
                username VARCHAR(15) UNIQUE,
                hashPass VARCHAR(60),
                google_id VARCHAR(60) UNIQUE,
                followed_users integer[],
                profile_picture TEXT
        );
            `);

        //Create post table
        await client.query(`
            CREATE TABLE IF NOT EXISTS post(
                post_id SERIAL PRIMARY KEY,
                content VARCHAR(255) NOT NULL,
                post_datetime TIMESTAMP,
                user_id int REFERENCES account(user_id),
                liked_users integer[],
                liked BOOLEAN DEFAULT FALSE
        );
            `);

        client.release();
        console.log('Database and tables created succesfully!');
        
    } catch (error) {
        console.log('Error creating database account and/or tables:', error);
    }
}

createDatabaseAndTables();