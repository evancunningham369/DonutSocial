import { pool } from "../config/database.js";

/**
 * API handlers for user accounts
 */

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
    const userId = req.body.userId;
    const profilePicturePath = req.file.path;
    
    try {
        const user = await pool.query('UPDATE account SET profile_picture=$1 WHERE user_id=$2 RETURNING profile_picture', [profilePicturePath, userId]);
        res.json(user.rows[0]);
    } catch (error) {
        res.json(error.message);
    }
}

// Get profile picture
export const get_profile_picture = async(req, res) => {
    try {
        const { userId } = req.params;
        const response = await pool.query('SELECT profile_picture FROM account WHERE user_id=$1', [userId]);
        
        const profilePictureURL = response.rows[0].profile_picture;
        return res.status(200).json(profilePictureURL);
    } catch (error) {
        return res.status(500).json(error);
    }
}

export const delete_profile_picture = async(req, res) => {
    try {
        const { userId } = req.params;
        const user = await pool.query('UPDATE account SET profile_picture=NULL WHERE user_id=$1', [userId]);
        res.status(200).json('Successfully removed profile picture');
    } catch (error) {
        res.status(500).json(error);
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