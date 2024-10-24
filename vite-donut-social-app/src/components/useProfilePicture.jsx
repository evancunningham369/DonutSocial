import donut from '/src/public/donut.jpg';
import { get_profile_picture } from '../../api/account.js';
import { useEffect, useState } from 'react';

function useProfilePicture(){

    const loggedInUserId = sessionStorage.getItem('userId');
    const [profilePicture, setProfilePicture] = useState(donut);

    useEffect(() => {
        const getProfilePicture = async(loggedInUserId) => {
            
            try {
                let url = await get_profile_picture(loggedInUserId);
                if(url.error){
                    url = donut;
                }
                if(JSON.stringify(url) !== JSON.stringify(profilePicture)){
                    setProfilePicture(donut);
                }
            } catch (error) {
                setProfilePicture(donut);
            }
        }
        getProfilePicture();
    }, [loggedInUserId])

    return { profilePicture };

}

export default useProfilePicture;