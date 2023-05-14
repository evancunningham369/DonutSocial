import bcrypt from 'bcrypt';
import { pool } from "../db.js";

/**
 * File for API handlers for user accounts
 */

// Register account in database
export const register_account = async(req, res) => {
    try {
        const { username, password } = req.body;
        const saltRounds = 5;
        var hashPass = await bcrypt.hash(password, saltRounds);
        const newAccount = await pool.query(
            'INSERT INTO account (username, hashPass) VALUES($1, $2) RETURNING username',
             [username, hashPass]
             );

        res.json(newAccount);
    } catch (error) {
        error.constraint != undefined && res.json("User with that name already exists!");
    }
}

// Login and verify account in database
export const login_account = async(req, res) => {
    try {
        const { username, password } = req.body;
        const result = await pool.query('SELECT * FROM account WHERE username= $1', [username]);
        if(result.rowCount == 0){
            throw new Error("Incorrect username!")
        }
        const user = result.rows[0];

        const match = await bcrypt.compare(password, user.hashpass);
        if(!match){
            throw new Error("Incorrect password!");
        }
        res.json(user);
    } catch (error) {
        res.json(error.message);    
    }
}

// Get account in database
export const get_account = async(req, res) => {
    try {
        const { userId } = req.params;
        const user = await pool.query('SELECT * FROM account WHERE user_id=$1', [userId]);
        res.json(user.rows);
    } catch (error) {
        res.json(error.message);
    }
}