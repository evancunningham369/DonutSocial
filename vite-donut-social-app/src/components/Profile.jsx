import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import * as account_req from '../../api/account.js';
import * as post_req from '../../api/post.js';
import * as user_action from '../../api/user.js';
import donut from '../public/donut.jpg';
import { useParams } from 'react-router-dom';
import Post from "./Post.jsx";
import useProfilePicture from "./useProfilePicture.jsx";

function Profile(){

    let loggedInUserId = sessionStorage.getItem('userId');
    
    const { userId, username } = useParams();
    
    const isOwnProfile = loggedInUserId == userId;
    const { profilePicture, setProfilePicture } = useProfilePicture(userId);
    const [followText, setFollowText] = useState('Follow');
    const [following, setFollowing] = useState(0);
    const [followers, setFollowers] = useState(0);
    const [posts, setPosts] = useState([]);
    const [selection, setSelection] = useState("");

    const userFollowingProfile = async() => {
        const isUserFollowing = await account_req.user_following_profile(loggedInUserId, userId);
        setFollowText(isUserFollowing.is_following ? "Unfollow": "Follow");
    }

    const getProfileInfo = async() => {
        const profileInfo = await account_req.get_profile_info(userId);
        
        const { followingCount: following, followerCount: followers } = profileInfo;
        
        setFollowers(followers);
        setFollowing(following);
    }

    useEffect(() => {
        post_req.get_my_posts(userId).then((posts) => setPosts(posts));
        
        if(isOwnProfile) return;
        userFollowingProfile();
    }, [profilePicture]);


    const getPost = async(event) => {
        const { id } = event.currentTarget;
        if(id == selection) return;

        let allPosts;
        switch(id){
            case 'user': 
                allPosts = await post_req.get_my_posts(isOwnProfile ? loggedInUserId : userId);
                setSelection('user');
                break;
            case 'liked': 
                allPosts = await post_req.get_liked_posts(isOwnProfile ? loggedInUserId: userId);
                setSelection('liked');
                break;
        }

        setPosts(allPosts);
    }
    
    const handleFileUpload = async(event) => {
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('profilePicture', file);
        formData.append('userId', loggedInUserId);
        
        const response = await account_req.upload_profile_picture(formData);
        let url = response.profile_picture;
        setProfilePicture('http://localhost:3001/'+ url.replace(/\\/g, '/'));
    }

    const removeProfilePicture = async() => {
        const response = await account_req.delete_profile_picture(loggedInUserId);
        console.log(response);
        setProfilePicture(donut);
    }

    const handleFollow = async() => {
        const response = followText == "Follow" ?  await user_action.follow_user(loggedInUserId, userId): await user_action.unfollow_user(loggedInUserId, userId);

        if(response.ok){
            setFollowText(followText == "Follow" ? "Unfollow" : "Follow");
        }
    }

    const deletePost = (postId) => {
        const newPosts = posts.filter(post => post.post_id !== postId);
        setPosts(newPosts);
    }

    return (
        <div className="profile">
            <h1>{username}'s Profile</h1>
            <div className="profile-picture">
                <img src={profilePicture} alt="Profile Picture" />
                <div className="avatar-buttons">
                    {isOwnProfile ? <>
                        <input style={{opacity: 0}} type="file" id="profilePicture" name="profilePicture" accept="image/*" onChange={handleFileUpload} />
                        <label className="btn btn-primary" htmlFor='profilePicture'>
                            Upload New Picture
                        </label>
                        <Button variant='danger' className="btn btn-primary" onClick={removeProfilePicture} type="button">Remove Avatar</Button>
                    </>: 
                    <button className="btn btn-primary" onClick={handleFollow}>{followText}</button>
                    }
                </div>
            </div>
            <div className="account-info">
                    <h4>Followers: {followers}</h4>
                    <h4>Following: {following}</h4>
            </div>
            <div className='btn-group' role="group">
                <input className='btn-check' id='user' onClick={getPost} type="radio" name='options' autoComplete="off" defaultChecked />
                <label className='btn btn-outline-primary'htmlFor="user">My Posts</label>
                <input className='btn-check' id='liked' onClick={getPost} type="radio" name='options' autoComplete="off" />
                <label className='btn btn-outline-primary'htmlFor="liked">Liked Posts</label>
            </div>
            <div className="user-posts">
            {posts.length == 0 ? <h1>No {selection} posts</h1> : posts.map((post) =>
                    <Post key={post.post_id} deletePost={deletePost} post={post}  />)}
            </div>
        </div>
    )
}

export default Profile;