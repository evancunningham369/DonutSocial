import bcrypt from 'bcrypt';
import { pool } from '../config/database.js';

//API Handlers for authentication

// Register account in database
export const register_account = async(req, res) => {
    try {
        const { username, password } = req.body;
        if(!username || !password){
            return res.status(400).json('Username and password fields cannot be empty');
        }
        const saltRounds = 5;
        var hashPass = await bcrypt.hash(password, saltRounds);
        const newAccount = await pool.query(
            'INSERT INTO account (username, hashPass) VALUES($1, $2) RETURNING *',
             [username, hashPass]
             );
        return res.status(200).json({message: `User ${newAccount.rows[0].user_id} has successfully registered`, userId: newAccount.rows[0].user_id, username: username});
    } catch (error) {
        if(error.constraint){
            return res.status(400).json("User with that name already exists!");
        }
        return res.status(500).json('An unexpected error occured');
    }
}

// Register or Login google account
export const google_strategy_callback = async(accessToken, refreshToken, profile, done) => {
    try {
        let user = await pool.query('SELECT * FROM account WHERE googleId = $1', [profile.id]);
        if (!user.rows.length) {
          await pool.query(
            'INSERT INTO account (googleId, username) VALUES ($1, $2)',
            [profile.id, profile.displayName]
          );
          user = await pool.query('SELECT * FROM account WHERE googleId = $1', [profile.id]);
        }
        user = user.rows[0];
        user.accessToken = accessToken;
        return done(null, user);
      } catch (err) {
        return done(err);
      }
}

export const callback_google_account = async(req, res) => {
    if(!req.user){
        return res.redirect('/');
    }
    return res.json({token: req.user.accessToken});
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
        res.status(200).json({message: `User ${user.user_id} has successfully logged in`, userId: user.user_id, username: user.username});
    } catch (error) {
        console.log(error);
        res.status(400).json(error.message);
    }
}