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