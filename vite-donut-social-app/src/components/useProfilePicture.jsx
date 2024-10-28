import donut from '/src/public/donut.jpg';
import { get_profile_picture } from '../../api/account.js';
import { useEffect, useState } from 'react';

function useProfilePicture(userId){
    
    const [profilePicture, setProfilePicture] = useState(donut);
    if(userId){
        const getProfilePicture = async() => {
            try {
                let url = await get_profile_picture(userId);
                
                if(url && url !== profilePicture){
                    setProfilePicture('http://localhost:3001/'+ url.replace(/\\/g, '/'));
                }
            } catch (error) {
                setProfilePicture(donut);
            }
        };
        getProfilePicture();
    }
    return { profilePicture, setProfilePicture };

}

export default useProfilePicture;