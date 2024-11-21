import { useState, useEffect } from 'react';
import * as user_action from '../../api/user.js';
import * as post_req from '../../api/post.js';
import useProfilePicture from './useProfilePicture.jsx';
import { Link } from 'react-router-dom';
import { like_icon, unlike_icon, trash_icon } from './icons.jsx'

function Post({post, deletePost }) {
    
    const loggedInUserId = sessionStorage.getItem('userId');
    
    const {username, user_id: userIdPoster, post_id: postId, content, post_datetime } = post;
    
    const { profilePicture } = useProfilePicture(userIdPoster);

    const [likeBtn, setLikeBtn] = useState(unlike_icon);

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
            deletePost(postId);
            toggleModal();
        }
    }

    const toggleModal = () => {
        const modal = document.getElementById('deleteConfirmationModal');
        modal.style.display = modal.style.display === 'none' ? 'flex' : 'none';
    }

    return (
        <div className='post'>
            <div className="post-heading">
                <div className="user-post-info">
                    <div className="profile-picture">
                        <Link to={`/profile/${userIdPoster}/${username}`}>
                            <img className='profile-picture custom-border-light' src={profilePicture} alt="post profile picture" />
                        </Link>
                    </div>
                    <h4 style={{ display: 'inline' }}>{username}</h4>
                </div>
                <p className='post-datetime'>{post_datetime}</p>
            </div>
            <div className="content">
                <p>{content}</p>
            </div>
            <div className="post-action-btn-group">
                <button className='like-btn' onClick={handleLike}>{likeBtn}</button>

                {postByCurrentUser && (<button className='trash' onClick={toggleModal}>{trash_icon}</button>)}
            </div>

            {/* DELETE CONFIRMATION MODAL BEGIN*/}
            <div id='deleteConfirmationModal' className='modal' style={{display: 'none'}}>
                <div id="modal-container">
                    <div id='modal-header'>
                        <h2 id='modal-title'>Delete this post?</h2>
                        <span id="close" onClick={toggleModal}>x</span>
                    </div>
                    <div id='modal-body'>
                        <div className='post'>
                            <div className="post-heading">
                                <div className="user-post-info">
                                    <img style={{ display: 'inline', width: '25px', height: '25px' }} src={profilePicture} alt="post profile picture" />
                                    <h4 style={{ display: 'inline' }}>{username}</h4>
                                </div>
                                <p className='post-datetime'>{post_datetime}</p>
                            </div>
                            <div className="content">
                                <p>{content}</p>
                            </div>
                        </div>
                    </div>
                    <div id='modal-footer'>
                        <button id='modal-button' className='button' onClick={handleDelete}>Delete Post</button>
                    </div>
                </div>
            </div>
            {/* DELETE CONFIRMATION MODAL END*/}
        </div>
    );
}

export default Post;