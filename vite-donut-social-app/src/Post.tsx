import { useState, useEffect } from 'react';
import * as user_action from '../api/user.js';
import * as post_req from '../api/post.js';
import { get_profile_picture } from '../api/account.js';
import { Link } from 'react-router-dom';

function Post(props){
    const { loggedInUserId, userIdPoster, post: { post_id: postId, content, post_datetime } } = props;
    const [likeText, setLikedText] = useState("Like");
    const [postProfilePic, setPostProfilePicture] = useState();
    const postByCurrentUser = loggedInUserId == userIdPoster;
    
    useEffect(() => {
        get_profile_picture(userIdPoster).then(profilePic => {
            setPostProfilePicture(profilePic);
        });
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
            <Link to='/profile' state={{userId: userIdPoster ,profilePicture: postProfilePic}}>
                <img style={{display: 'inline',width: '25px', height: '25px'}} src={postProfilePic} alt="post profile picture" />
            </Link>
            <h4 style={{display: 'inline'}}>User {userIdPoster}</h4>
            <p>{content}</p>
            <p>{post_datetime}</p>
            <button onClick={handleLike}>{likeText}</button>
            {postByCurrentUser && (<button onClick={deletePost}>Delete Post</button>)}
        </>
    );
}

export default Post;