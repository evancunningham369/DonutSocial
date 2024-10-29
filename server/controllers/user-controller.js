import { pool } from "../config/database.js";
/**
 * File to hold API requests for user actions
 */

// Adds/Removes follower/followed user relationship from follower table
export const follow_user = async (req, res) => {
        const { followerId, followedId } = req.params;
    try {
        const result = await pool.query(`
            SELECT * 
            FROM followers 
            WHERE follower_id = $1 AND followed_id = $2`,
             [followerId, followedId]);

        if(result.rows.length > 0){
            await pool.query(`
                DELETE FROM followers
                WHERE follower_id = $1 AND followed_id = $2`,
            [followerId, followedId]);
            res.status(200).json({follow: false, message: 'Unfollowed successfully'});
        }
        else{
            await pool.query(`
                INSERT INTO followers (follower_id, followed_id) 
                VALUES ($1, $2)`, 
                [followerId, followedId]);
                res.status(200).json({follow: true, message: 'Followed successfully'});
        }
        
    } catch (error) {
        res.status(500).json(error.message);
    }
}

// Adds or removes userId from liked posts array
export const like_post = async (req, res) => {
    try {
        
        const { userId, postId } = req.params;

        const post = await pool.query(`
            SELECT liked_users
            FROM post
            WHERE post_id = $1`,
        [postId]);
        
        if(post.rows.length === 0){
            
            return res.status(404).json({message: 'Post not found'});
        }
        
        const likedUsers = post.rows[0].liked_users || [];

        let updatedPost;
        if(likedUsers.includes(Number(userId))){
            updatedPost = await pool.query(
            `UPDATE post
                SET liked_users= array_remove(liked_users, $1) 
                WHERE post_id = $2`,
            [userId, postId]);

            res.json({liked: false})
        }
        else{
        updatedPost = await pool.query(`
            UPDATE post 
            SET liked_users = array_append(liked_users, $1) 
            WHERE post_id = $2`,
             [userId, postId]);

             res.json({liked: true});
        }

    } catch (error) {
        res.status(500).json(error.message);
    }
}