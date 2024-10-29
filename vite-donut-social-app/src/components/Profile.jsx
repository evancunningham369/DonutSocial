import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
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
    }, [profilePicture, followText]);
    
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
        const response = await user_action.follow_user(loggedInUserId, userId);
        let data = await response.json();
        if(response.ok){
            setFollowText(data.follow ? 'Unfollow' : 'Follow');
        }
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
                <input id='my-posts' className='btn-check' onChange={(e) => setSelection('user')} type="radio" name='options' autoComplete="off" defaultChecked />
                <label className='btn btn-outline-primary'htmlFor="my-posts">My Posts</label>
                <input id='liked-posts' className='btn-check' onChange={(e) => setSelection('liked')} type="radio" name='options' autoComplete="off" />
                <label className='btn btn-outline-primary'htmlFor="liked-posts">Liked Posts</label>
            </div>
            <div className="user-posts">
            < Posts postType = {selection}/>
            </div>
        </div>
    )
}

export default Profile;