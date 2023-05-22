import { useState, useRef, useEffect } from "react";
import * as account_req from '../api/account.js';

function Profile(){
    let loggedInUserId = sessionStorage.getItem('userId');
    const [profilePicture, setProfilePicture] = useState();
    const fileInputRef = useRef();

    useEffect(() => {
        async function getProfilePicture(){
            const url = await account_req.get_profile_picture(loggedInUserId);
            setProfilePicture(url);
        }
        getProfilePicture();
    })

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

    const removeProfilePicture = e => {
        //const response = await account_req.remove_profile_picture(profilePictureId);
    }
    return (
        <>
            <h1>User {loggedInUserId}'s Profile</h1>
            <div className="profile-picture">
                <img style={{display: "block"}} src={profilePicture} alt="Profile Picture" />
                <button onClick={() => {fileInputRef.current.click()}}>Upload Avatar</button>
                <input onChange={handleImage} multiple={false} ref={fileInputRef} type="file" hidden />
                <button onClick={removeProfilePicture} type="button">Remove Avatar</button>
            </div>
        </>
    )
}

export default Profile;