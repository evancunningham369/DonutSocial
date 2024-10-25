import { useState, useEffect } from 'react';
import * as user_action from '../../api/user.js';
import * as post_req from '../../api/post.js';
import { get_profile_picture } from '../../api/account.js';
import { Link } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import { like_icon, unlike_icon, trash_icon } from './icons.jsx'
import usePosts from './usePosts.jsx';

function Post({ userIdPoster, initialPost, deletePost }) {
    
    const { post_id: postId, content, post_datetime } = initialPost;

    const loggedInUserId = sessionStorage.getItem('userId');
    

    const [likeText, setLikedText] = useState("Like");
    const [likeBtn, setLikeBtn] = useState(unlike_icon);

    const [showDeleteConfirmation, setDeleteConfirmation] = useState(false);
    const [title, setTitle] = useState();
    const [postProfilePic, setPostProfilePicture] = useState();
    const postByCurrentUser = loggedInUserId == userIdPoster;

    useEffect(() => {
        const fetchProfilePicture = async () => {
            const profilePic = await get_profile_picture(userIdPoster);
            setPostProfilePicture(profilePic ? profilePic : '/src/public/donut.jpg');
        }
        async function setInitialText() {
            try {
                const data = await post_req.get_liked_posts_by_id(loggedInUserId);
                if (data.liked_posts == null) return;
                const isPostLiked = data.liked_posts.includes(postId);
                setLikeBtn(isPostLiked ? like_icon : unlike_icon);
                setLikedText(isPostLiked ? "Unlike" : "Like");
            } catch (error) {
                return;
            }
        }
        fetchProfilePicture();
        setInitialText();
    }, []);


    const handleLike = async () => {
        setLikeBtn(likeText == "Like" ? like_icon : unlike_icon);
        setLikedText(likeText == "Like" ? "Unlike" : "Like");

        likeText == "Like" ? await user_action.like_post(loggedInUserId, postId) : await user_action.unlike_post(loggedInUserId, postId);
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
            <hr className='solid' />
            <div className="post-heading">
                <div className="user-post-info">
                    <div className="profile-picture">
                        <Link to='/profile' state={{ userId: userIdPoster, profilePicture: postProfilePic }}>
                            <img src={postProfilePic} alt="post profile picture" />
                        </Link>
                    </div>
                    <h4 style={{ display: 'inline' }}>User {userIdPoster}</h4>
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
                                <img style={{ display: 'inline', width: '25px', height: '25px' }} src={postProfilePic} alt="post profile picture" />
                                <h4 style={{ display: 'inline' }}>User {userIdPoster}</h4>
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