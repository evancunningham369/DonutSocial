import donut from '/src/public/donut.jpg';
import { get_profile_picture } from '../../api/account.js';
import { useEffect, useState } from 'react';

function useProfilePicture(){
    const [profilePicture, setProfilePicture] = useState(donut);

    useEffect(() => {
        async function getProfilePicture() {
    
            try {
                const url = await get_profile_picture(loggedInUserId);
                if (url == null) throw TypeError
        
                setProfilePicture(url);
            } catch (error) {
                setProfilePicture(donut);
            }
        }
        getProfilePicture();
    })

    return { profilePicture };
}

export default useProfilePicture;