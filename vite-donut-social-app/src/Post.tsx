import { useState, useEffect } from 'react';
import * as user_action from '../api/user.js';
import * as post_req from '../api/post.js';

function Post(props){
    const { loggedInUserId, userIdPoster, post: { post_id: postId, content, post_datetime } } = props
    const [likeText, setLikedText] = useState("Like");

    useEffect(() => {
        async function setInitialText(){
            try {
                const data = await post_req.get_liked_posts_by_id(loggedInUserId);
                if(data.liked_posts == null) return;
                const isPostLiked = data.liked_posts.includes(postId);
                setLikedText(isPostLiked ? "Unlike": "Like");
            } catch (error) {
                return;
            }
        }
        setInitialText();
    }, [])

    
    const postByCurrentUser = loggedInUserId == userIdPoster;
    
    const handleLike = async() => {
        setLikedText(likeText == "Like" ? "Unlike" : "Like");
        
        const response = likeText == "Like" ?  await user_action.like_post(loggedInUserId, postId) : await user_action.unlike_post(loggedInUserId, postId);
    }

    const deletePost = async() => {
        const response = await user_action.delete_post(postId);
        if(response.ok){
            console.log("Post deleted");
            
        }
    }

    return (
        <>
            <hr className='solid'/>
            <h4>User {userIdPoster}</h4>
            <p>{content}</p>
            <p>{post_datetime}</p>
            <button onClick={handleLike}>{likeText}</button>
            {postByCurrentUser ? (<button onClick={deletePost}>Delete Post</button>) : null}
        </>
    );
}

export default Post;