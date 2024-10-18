import { pool } from "../config/database.js";

/**
 * File to hold API requests for social media posts
 */

// Creates a post in the database for the account
export const create_post = async(req, res) => {
    try {
        const dateTime = new Date(Date.now()).toISOString();
        const {content, userId} = req.body;
        const post = await pool.query(
            'INSERT INTO post(content, post_datetime, user_id) VALUES($1, $2, (SELECT user_id FROM account WHERE user_id=$3)) RETURNING *',
            [content, dateTime, userId]
            );
        res.json(post.rows);
    } catch (error) {
        console.log(error.message);
    }
}

// Updates the post with new content
export const update_post = async (req, res) => {
    try {
        const { postId } = req.params;
        const { content } = req.body;
        const updatedPost = await pool.query('UPDATE post SET content=$1 WHERE post_id=$2 RETURNING *', [content, postId]);
        res.json(updatedPost.rows);
    } catch (error) {
        res.json(error.message);
    }
}

// Get a post
export const get_post = async (req, res) => {
    try {
        const { postId } = req.params;
        const post = await pool.query('SELECT * FROM post WHERE post_id=$1', [postId]);
        res.json(post.rows);
    } catch (error) {
        res.json(error.message)
    }
}

// Get all posts
export const get_all_posts = async(req, res) => {
    try {
        const allPosts = await pool.query('SELECT * FROM post');
        res.json(allPosts.rows);
    } catch (error) {
        res.json(error.message);
    }
}

// Gets all posts that the user is following
export const get_user_following_posts = async(req, res) => {
    try {
        const { userId } = req.params;
        const users_followed = await pool.query('SELECT followed_users FROM account WHERE user_id=$1', [userId]);
        const followingPosts = await pool.query('SELECT * FROM post WHERE user_id=ANY($1)', [users_followed.rows[0].followed_users]);
        res.json(followingPosts.rows);
    } catch (error) {
        res.json(error.message);
    }
}

// Gets all posts that the user has liked
export const get_user_liked_posts = async(req, res) => {
    try {
        const { userId } = req.params;
        const likedPosts = await pool.query('SELECT * FROM post WHERE $1=ANY(liked_users)', [userId]);
        res.json(likedPosts.rows);
    } catch (error) {
        res.json(error.message);
    }
}

// Gets all post_ids that the user has liked
export const get_user_liked_posts_id = async(req, res) => {
    try {
        const { userId } = req.params;
        const likedPostIds = await pool.query('SELECT liked_posts FROM account WHERE user_id=$1', [userId]);
        res.send(likedPostIds.rows[0]);
    } catch (error) {
        res.json(error.message);
    }
}

// Gets all user posts
export const get_user_posts = async(req, res) => {
    try {
        const { userId } = req.params;
        const allPosts = await pool.query('SELECT * FROM post WHERE user_id=$1', [userId]);
        res.json(allPosts.rows);
    } catch (error) {
        res.json(error.message);
    }
}

// Delete a post
export const delete_post = async(req, res) => {
    try {
        const { postId } = req.params;
        const deletedPost = await pool.query('DELETE FROM post WHERE post_id=$1', [postId]);
        const deleteAccountLikes = await pool.query('UPDATE account SET liked_posts = array_remove(liked_posts, $1)', [postId]);
        res.json(deletedPost.rows);
    } catch (error) {
        res.json(error.message);
    }
}