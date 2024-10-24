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
        return res.status(200).json(url);
    } catch (error) {
        return res.status(500).json(error);
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