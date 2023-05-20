import { useState } from 'react';
import * as user_action from '../api/user.js';

function Post(props){
    
    const { loggedInUserId, userIdPoster, liked, post: { post_id: postId, content, post_datetime } } = props

    const postByCurrentUser = loggedInUserId == userIdPoster;
    const initialLikeStatus = liked ? "Unlike" : "Like";
    
    const [like, setLike] = useState(liked);
    const [likeText, setLikeText] = useState(initialLikeStatus);

    const handleLike = async() => {
        
        const response = like ? await user_action.unlike_post(loggedInUserId, postId): await user_action.like_post(loggedInUserId, postId);
        
        if(response.ok){ 
            setLike(!like);
            setLikeText(!like ? "Unlike": "Like");
        }
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