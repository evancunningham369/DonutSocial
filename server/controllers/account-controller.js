import bcrypt from 'bcrypt';
import { pool, cloudinary } from "../config/config.js";

/**
 * File for API handlers for user accounts
 */

// Register account in database
export const register_account = async(req, res) => {
    try {
        const { username, password } = req.body;
        if(!username || !password){
            res.status(400).json('Username or password fields cannot be empty');
        }
        const saltRounds = 5;
        var hashPass = await bcrypt.hash(password, saltRounds);
        const newAccount = await pool.query(
            'INSERT INTO account (username, hashPass) VALUES($1, $2) RETURNING user_id',
             [username, hashPass]
             );

        res.status(200).json({message: `User ${newAccount.rows[0].user_id} has successfully registered`, userId: newAccount.rows[0].user_id});
    } catch (error) {
        error.constraint != undefined && res.status(400).json("User with that name already exists!");
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
        res.status(200).json({message: `User ${user.user_id} has successfully logged in`, userId: user.user_id});
    } catch (error) {
        res.status(400).json(error.message);
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

// Upload profile picture
export const upload_profile_picture = async(req, res) => {
    try {
        const { userId, file } = req.body;
        const cloudRes = await cloudinary.uploader.upload(file, {public_id: `user_${userId}_profile_picture`});

        const user = await pool.query('UPDATE account SET profile_picture_id=$1 WHERE user_id=$2 RETURNING *', [cloudRes.public_id, userId]);
        res.json(user.rows);
    } catch (error) {
        res.json(error.message);
    }
}

// Get profile picture
export const get_profile_picture = async(req, res) => {
    try {
        const { profilePictureId } = req.query;
        const url = await cloudinary.url(profilePictureId, {
            width: 100,
            height: 150,
            crop: 'fill'
        });
        res.json(url);
    } catch (error) {
        res.json(error.message);
    }
}