import { useState, useRef, useEffect } from "react";
import * as account_req from '../api/account.js';
import * as user_action from '../api/user.js';
import { useLocation } from "react-router-dom";

function Profile(){
    
    let loggedInUserId = sessionStorage.getItem('userId');
    const location = useLocation();
    const { userId } = location.state;
    const isOwnProfile = loggedInUserId == userId;
    const [profilePicture, setProfilePicture] = useState(location.state.profilePicture);
    const [followText, setFollowText] = useState('Follow');
    const fileInputRef = useRef();
    const followers = 0;
    const following = 0;

    const userFollowingProfile = async() => {
        const isUserFollowing = await account_req.user_following_profile(loggedInUserId, userId);
        setFollowText(isUserFollowing.is_following ? "Unfollow": "Follow");
    }

    useEffect(() => {
        if(isOwnProfile) return;
        userFollowingProfile();
    }, [])


    
    const handleImage = async() => {
        const file = fileInputRef.current.files[0];
        
        setFileToBase(file);
    }

    const setFileToBase = (file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            const profileImage = reader.result;
            setProfilePicture(profileImage);
            uploadProfilePicture(profileImage);
        }
    }
    
    const uploadProfilePicture = async(profileImage) => {
        let data = {image: profileImage, userId: loggedInUserId}
        const response = await account_req.upload_profile_picture(data);
    }

    const removeProfilePicture = async() => {
        const response = await account_req.delete_profile_picture(loggedInUserId);
        console.log(response);
    }

    const handleFollow = async() => {
        const response = followText == "Follow" ?  await user_action.follow_user(loggedInUserId, userId): await user_action.unfollow_user(loggedInUserId, userId);

        if(response.ok){
            setFollowText(followText == "Follow" ? "Unfollow" : "Follow");
        }
    }

    return (
        <>
            <h1>User {userId}'s Profile</h1>
            <div className="profile-picture">
                <img style={{width: '100px', height:'100'}} src={profilePicture} alt="Profile Picture" />
                {isOwnProfile ? <>
                    <button onClick={() => {fileInputRef.current.click()}}>Upload Avatar</button>
                    <input onChange={handleImage} multiple={false} ref={fileInputRef} type="file" hidden />
                    <button onClick={removeProfilePicture} type="button">Remove Avatar</button>
                </>: 
                <button onClick={handleFollow}>{followText}</button>
                }
            </div>
            <div className="account-info">
                    <h4>Followers: {followers}</h4>
                    <h4>Following: {following}</h4>
            </div>
        </>
    )
}

export default Profile;