import { useState } from 'react';
import { like_post, unlike_post } from '../api/user.js';

function Post(props){
    const { userId, post: { post_id: postId, content, post_datetime } } = props
    
    const [like, setLike] = useState(true);
    const [likeText, setLikeText] = useState("Like");

    const handleLike = async() => {
        const response = like ? await like_post(userId, postId): await unlike_post(userId, postId);
        
        if(response.ok){
            setLikeText(!like ? "Like": "Unlike");
            setLike(!like);
        }
    }

    return (
        <>
            <p>{content}</p>
            <p>{post_datetime}</p>
            <button onClick={handleLike}>{likeText}</button>
        </>
    );
}

export default Post;