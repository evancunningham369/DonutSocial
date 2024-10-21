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
        return res.redirect('http://localhost:5173/home');
    } catch (error) {
        if(error.constraint){
            return res.status(400).json("User with that name already exists!");
        }
        return res.status(500).json('An unexpected error occured:');
    }
}

// Register or Login google account
export const google_strategy = async(accessToken, refreshToken, profile, done) => {
    try {
        let user = await pool.query('SELECT * FROM account WHERE google_id = $1', [profile.id]);
        if (!user.rows.length) {
          await pool.query(
            'INSERT INTO account (google_id, username) VALUES ($1, $2)',
            [profile.id, profile.displayName]
          );
          user = await pool.query('SELECT * FROM account WHERE google_id = $1', [profile.id]);
        }
        user = user.rows[0];
        user.accessToken = accessToken;
        return done(null, user);
      } catch (err) {
        return done(err);
      }
}

// callback for google register/login
export const callback_google_account = async(req, res) => {
    if(!req.user){
        return res.redirect('/');
    }
    return res.redirect('http://localhost:5173/home');
}

// Login and verify account in database
export const login_account = async(username, password, done) => {
    try {
        const result = await pool.query('SELECT * FROM account WHERE username= $1', [username]);
        if(result.rowCount == 0){
            return done(null, false, {message: "Incorrect username!"})
        }
        const user = result.rows[0];
        
        const match = await bcrypt.compare(password, user.hashpass);
        if(!match){
            return done(null, false, {message: "Incorrect password!"})
        }
        return done(null, user);
    } catch (error) {
        return done(error);
    }
}

export const login_callback = async(req, res) => {
    if(req.user){
        return res.redirect('http://localhost:5173/home');
    }
    return res.redirect('http://localhost:5173/register');
}

export const logout = async(req, res) => {
        req.logout(err => {
            if(err) return res.status(500).json({ message : 'Logout failed' });
    
            req.session.destroy();
            return res.redirect('http://localhost:5173/register');
        });
}