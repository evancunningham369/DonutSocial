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
            'INSERT INTO account (username, hashPass) VALUES($1, $2) RETURNING *',
             [username, hashPass]
             );
        res.status(200).json({message: `User ${newAccount.rows[0].user_id} has successfully registered`, userId: newAccount.rows[0].user_id, username: username});
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
        res.status(200).json({message: `User ${user.user_id} has successfully logged in`, userId: user.user_id, username: user.username});
    } catch (error) {
        console.log(error);
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
        const { userId, image } = req.body;
        if(cloudinary == undefined){
            throw new Error("Cloudinary is undefined")
        }
        const cloudRes = await cloudinary.uploader.upload(image, {public_id: `user_${userId}_profile_picture`});
        const user = await pool.query('UPDATE account SET profile_picture_id=$1 WHERE user_id=$2 RETURNING *', [cloudRes.public_id, userId]);
        res.json(user.rows);
    } catch (error) {
        res.json(error.message);
    }
}

// Get profile picture
export const get_profile_picture = async(req, res) => {
    try {
        const { userId } = req.params;
        const response = await pool.query('SELECT profile_picture_id FROM account WHERE user_id=$1', [userId]);
        const profilePictureId = response.rows[0].profile_picture_id;
        const url = await cloudinary.url(profilePictureId, {
            width: 100,
            height: 150,
            crop: 'fill',
            format:'jpg'
        });
        res.json(url);
    } catch (error) {
        res.json(error.message);
    }
}

export const delete_profile_picture = async(req, res) => {
    try {
        const { userId } = req.params;
        const user = await pool.query('UPDATE account SET profile_picture_id=NULL WHERE user_id=$1 RETURNING(SELECT profile_picture_id FROM account WHERE user_id=$1)', [userId]);
        const profilePictureId = user.rows[0].profile_picture_id;
        cloudinary.uploader.destroy(profilePictureId);
        res.json(user);
    } catch (error) {
        res.json(error);
    }
}

export const is_user_following = async(req, res) => {
    try {
        const { userId, profileId } = req.query;
        const followed = await pool.query('SELECT followed_users FROM account WHERE user_id=$1', [userId]);
        const followed_users = followed.rows[0].followed_users;
        const response = await pool.query('SELECT $1 = ANY($2) as is_following', [profileId, followed_users]);
        res.json(response.rows[0]);
    } catch (error) {
        res.json(error.message);
    }
}

export const get_profile_info = async(req, res) => {
    try {
        const { userId } = req.params;
        const following = await pool.query('SELECT COALESCE(array_length(followed_users, 1), 0) as followingCount FROM account WHERE user_id=$1', [userId]);
        const follower = await pool.query('SELECT COALESCE(array_length(followers, 1), 0) as followerCount FROM account WHERE user_id=$1', [userId]);
        const profileInfo = {followingCount: following.rows[0].followingcount, followerCount: follower.rows[0].followercount}
        res.json(profileInfo);
    } catch (error) {
        console.log(error);
        res.json(error.message);
    }
}