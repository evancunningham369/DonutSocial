import { useState, useEffect } from 'react';
import * as user_action from '../api/user.js';
import * as post_req from '../api/post.js';
import { get_profile_picture } from '../api/account.js';
import donut from './donut.jpg';
import { Link } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import { like, unlike, trash } from './icons.tsx'

function Post(props){
    const { loggedInUserId, userIdPoster , initialPost, deletePost } = props;
    const { post_id: postId, content, post_datetime } = initialPost;

  
    const [likeText, setLikedText] = useState("Like");
    const [likeBtn, setLikeBtn] = useState(unlike);
    
    const [showDeleteConfirmation, setDeleteConfirmation] = useState(false);
    const [title, setTitle] = useState();
    const [postProfilePic, setPostProfilePicture] = useState();
    const postByCurrentUser = loggedInUserId == userIdPoster;
    
    useEffect(() => {
        get_profile_picture(userIdPoster).then(profilePic => {
            setPostProfilePicture(profilePic ? profilePic : donut);
        });
        async function setInitialText(){
            try {
                const data = await post_req.get_liked_posts_by_id(loggedInUserId);
                if(data.liked_posts == null) return;
                const isPostLiked = data.liked_posts.includes(postId);
                setLikeBtn(isPostLiked ? like: unlike);
                setLikedText(isPostLiked ? "Unlike": "Like");
            } catch (error) {
                return;
            }
        }
        setInitialText();
    }, [])
    
    
    const handleLike = async() => {
        setLikeBtn(likeText == "Like" ? like: unlike);
        setLikedText(likeText == "Like" ? "Unlike" : "Like");
        
        const response = likeText == "Like" ?  await user_action.like_post(loggedInUserId, postId) : await user_action.unlike_post(loggedInUserId, postId);
    }

    const handleDelete = async() => {
    
    const response = await user_action.delete_post(postId);
    if(response.ok){
                setDeleteConfirmation(false);
                setTitle('Post deleted');
                deletePost(postId);
            }
    }
    
    return (
        <div className='post'>
            <div className="post-heading">
                <div className="user-post-info">
                <Link to='/profile' state={{userId: userIdPoster ,profilePicture: postProfilePic}}>
                    <img style={{display: 'inline',width: '25px', height: '25px'}} src={postProfilePic} alt="post profile picture" />
                </Link>
                <h4 style={{display: 'inline'}}>User {userIdPoster}</h4>
                </div>
                <p className='post-datetime'>Posted on: {post_datetime}</p>
            </div>
            <div className="content">
                <p>{content}</p>
            </div>
            <div className="post-action-btn-group">
                <button className='like-btn' onClick={handleLike}>{likeBtn}</button>
                
                {postByCurrentUser && (<button className='trash' onClick={() => {setDeleteConfirmation(true); setTitle('Delete this post?')}}>{trash}</button>)}
            </div>


            <Modal show={showDeleteConfirmation} size='lg'>
                <Modal.Header>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='post'>
                        <div className="post-heading">
                            <div className="user-post-info">
                                <img style={{display: 'inline',width: '25px', height: '25px'}} src={postProfilePic} alt="post profile picture" />
                                <h4 style={{display: 'inline'}}>User {userIdPoster}</h4>
                            </div>
                            <p className='post-datetime'>Posted on: {post_datetime}</p>
                        </div>
                        <div className="content">
                            <p>{content}</p>
                            </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button className='btn btn-outline-danger' onClick={handleDelete}>Delete Post</button>
                    <button className='btn btn-outline-primary' onClick={() => setDeleteConfirmation(false)}>Cancel</button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default Post;