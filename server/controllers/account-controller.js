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
        const { followerId, followedId } = req.params;
        const result = await pool.query(`
            SELECT EXISTS (
                SELECT 1
                FROM followers
                WHERE follower_id = $1 AND followed_id = $2)`,
        [followerId, followedId]);

        res.status(200).json({follow: result.rows[0].exists});
    } catch (error) {
        res.status(500).json(error.message);
    }
}

export const get_profile_info = async(req, res) => {
    try {
        const { userId } = req.params;
        
        let result = await pool.query(`
            SELECT COUNT(followed_id) AS following_count
            FROM followers
            WHERE follower_id = $1`,
        [userId]);
        const followingCount = result.rows[0].following_count;
        
        result = await pool.query(`
            SELECT COUNT(follower_id) AS follower_count
            FROM followers
            WHERE followed_id = $1`,
        [userId]);
        const followerCount = result.rows[0].follower_count;

        res.status(200).json({followerCount: followerCount, followingCount: followingCount});
    } catch (error) {
        res.status(500).json(error.message);
    }
}