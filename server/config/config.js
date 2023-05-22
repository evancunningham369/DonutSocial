import * as dotenv from 'dotenv';
dotenv.config();

import pg from "pg";
const { Pool } = pg;

import { v2 } from 'cloudinary';

// Postgres configuration
export const pool = new Pool({
    user: 'postgres',
    password: process.env.psqlPass,
    host:'localhost',
    port: 5432,
    database: 'socialdb'
});

// Cloudinary configuration
v2.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret
});

export const cloudinary = v2;