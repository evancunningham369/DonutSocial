import { useState, useEffect } from "react";
import * as account_req from '../../api/account.js';
import * as post_req from '../../api/post.js';
import * as user_action from '../../api/user.js';
import donut from '../public/donut.jpg';
import { useParams } from 'react-router-dom';
import Posts from "./Posts.jsx";
import useProfilePicture from "./useProfilePicture.jsx";

function Profile(){

    let loggedInUserId = sessionStorage.getItem('userId');
    
    const { userId, username } = useParams();
    
    const isOwnProfile = loggedInUserId == userId;
    const { profilePicture, setProfilePicture } = useProfilePicture(userId);
    const [followText, setFollowText] = useState('Follow');
    const [following, setFollowing] = useState(0);
    const [followers, setFollowers] = useState(0);
    const [selection, setSelection] = useState('user');

    const getProfileInfo = async() => {
        
        if(!isOwnProfile){
            const response = await account_req.user_following_profile(loggedInUserId, userId);

            setFollowText(response.follow ? 'Unfollow' : 'Follow');
        }
        const response = await account_req.get_profile_info(userId);
        const profileInfo = await response.json();
        if(response.ok){
            
            setFollowing(profileInfo.followingCount);
            setFollowers(profileInfo.followerCount);
        }
    }

    useEffect(() => {
        getProfileInfo();
    });
    
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
        setProfilePicture(donut);
    }

    const handleFollow = async() => {
        const response = await user_action.follow_user(loggedInUserId, userId);
        let data = await response.json();
        if(response.ok){
            setFollowText(data.follow ? 'Unfollow' : 'Follow');
        }
    }

    return (
        <div className="profile">
            <div className="profile-header">
                <h1 id="profile-user-title">{username}</h1>
                <div id="user-profile-picture">
                    <img className="custom-border-dark profile-picture" src={profilePicture} alt="Profile Picture" />
                    <div className="avatar-buttons">
                        {isOwnProfile ? <>
                            <input type="file" id="profilePicture" name="profilePicture" accept="image/*" onChange={handleFileUpload} />
                            <label id="upload" className="button profile-button" htmlFor='profilePicture'>
                                <img src="/icons/upload.png" alt="upload-icon" />
                                <span className="profile-button-text">Upload</span>
                            </label>
                            <button id="remove" className="button profile-button" onClick={removeProfilePicture} type="button">
                                <img src="/icons/cross-circle.png" alt="remove-icon" />
                                <span className="profile-button-text">Remove</span>
                            </button>
                        </>: 
                        <button className="button" onClick={handleFollow}>{followText}</button>
                        }
                    </div>
                </div>
                <div className="account-info">
                        <h4 id="follower">{followers} Followers</h4>
                        <h4 id="following">{following} Following</h4>
                </div>
            </div>
            <div className='filter-feed' role="group">
                <input id='my-posts' className='radio' onChange={(e) => setSelection('user')} type="radio" name='options' autoComplete="off" defaultChecked />
                <label className='filter-button left-label'htmlFor="my-posts">{username}'s Posts</label>
                <input id='liked-posts' className='radio' onChange={(e) => setSelection('liked')} type="radio" name='options' autoComplete="off" />
                <label className='filter-button right-label'htmlFor="liked-posts">Liked Posts</label>
            </div>
            <div id="profile-posts">
                < Posts postType = {selection}/>
            </div>
        </div>
    )
}

export default Profile;