import { useState } from 'react';
import { like_post, unlike_post } from '../api/user.js';

function Post(props){
    const { userId, liked, post: { post_id: postId, content, post_datetime } } = props
    
    const initialLike = liked ? true : false;
    const initialLikeStatus = liked ? "Unlike" : "Like";

    const [like, setLike] = useState(initialLike);
    const [likeText, setLikeText] = useState(initialLikeStatus);

    const handleLike = async() => {
        const response = like ? await unlike_post(userId, postId): await like_post(userId, postId);
        
        if(response.ok){
            setLikeText(!like ? "Unlike": "Like");
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