import { pool } from "../db.js";

export const follow_user = async (req, res) => {
    try {
        const { userId, userToFollow } = req.query;
        const user = await pool.query('UPDATE account SET followed_users = array_append(followed_users, $2) WHERE user_id=$1 RETURNING *', [userId, userToFollow])
        res.json(user.rows);
    } catch (error) {
        res.json(error.message);
    }
}

export const unfollow_user = async(req, res) => {
    try {
        const { userId, userToUnfollow } = req.query;
        const user = await pool.query('UPDATE account SET followed_users = array_remove(followed_users, $2) WHERE user_id=$1', [userId, userToUnfollow]);
        res.json(user.rows);
    } catch (error) {
        res.json(error.message);
    }
}

export const like_post = async (req, res) => {
    try {
        const { userId, postId } = req.query;
        const updatedPost = await pool.query('UPDATE post SET liked_users= array_append(liked_users, $1) WHERE post_id = $2 RETURNING *', [userId, postId]);
        res.json(updatedPost.rows);
    } catch (error) {
        res.json(error.message);
    }
}

export const unlike_post = async (req, res) => {
    try {
        const { userId, postId } = req.query;
        const updatedPost = await pool.query('UPDATE post SET liked_users = array_remove(liked_users, $1) WHERE post_id = $2 RETURNING *', [userId, postId]);
        res.json(updatedPost.rows);
    } catch (error) {
        res.json(error.message);
    }
}