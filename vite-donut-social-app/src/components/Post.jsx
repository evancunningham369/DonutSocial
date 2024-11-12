import { useState, useEffect } from 'react';
import * as user_action from '../../api/user.js';
import * as post_req from '../../api/post.js';
import useProfilePicture from './useProfilePicture.jsx';
import { Link } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import { like_icon, unlike_icon, trash_icon } from './icons.jsx'

function Post({post, deletePost }) {
    
    const loggedInUserId = sessionStorage.getItem('userId');
    
    const {username, user_id: userIdPoster, post_id: postId, content, post_datetime } = post;
    
    const { profilePicture } = useProfilePicture(userIdPoster);

    const [likeBtn, setLikeBtn] = useState(unlike_icon);

    const [showDeleteConfirmation, setDeleteConfirmation] = useState(false);
    const [title, setTitle] = useState();
    const postByCurrentUser = loggedInUserId == userIdPoster;

    useEffect(() => {
        
        async function setInitialText() {
            try {
                const likedUsers = await post_req.get_liked_posts_by_id(postId);
                
                if(likedUsers.liked_users.includes(parseInt(loggedInUserId, 10))){
                    setLikeBtn(like_icon);
                }
            } catch (error) {
                return;
            }
        }
        setInitialText();
    }, []);


    const handleLike = async () => {
        const response = await user_action.like_post(loggedInUserId, postId);
        setLikeBtn(response.liked ? like_icon : unlike_icon);
    }

    const handleDelete = async () => {

        const response = await user_action.delete_post(postId);
        
        if (response.ok) {
            setDeleteConfirmation(false);
            setTitle('Post deleted');
            deletePost(postId);
        }
    }

    return (
        <div className='post'>
            <div className="post-heading">
                <div className="user-post-info">
                    <div className="profile-picture">
                        <Link to={`/profile/${userIdPoster}/${username}`}>
                            <img src={profilePicture} alt="post profile picture" />
                        </Link>
                    </div>
                    <h4 style={{ display: 'inline' }}>{username}</h4>
                </div>
                <p className='post-datetime'>Posted on: {post_datetime}</p>
            </div>
            <div className="content">
                <p>{content}</p>
            </div>
            <div className="post-action-btn-group">
                <button className='like-btn' onClick={handleLike}>{likeBtn}</button>

                {postByCurrentUser && (<button className='trash' onClick={() => { setDeleteConfirmation(true); setTitle('Delete this post?') }}>{trash_icon}</button>)}
            </div>

            <Modal show={showDeleteConfirmation} size='lg'>
                <Modal.Header>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='post'>
                        <div className="post-heading">
                            <div className="user-post-info">
                                <img style={{ display: 'inline', width: '25px', height: '25px' }} src={profilePicture} alt="post profile picture" />
                                <h4 style={{ display: 'inline' }}>{username}</h4>
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