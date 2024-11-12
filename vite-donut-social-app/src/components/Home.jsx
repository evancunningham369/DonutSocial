import { Link } from 'react-router-dom';
import Posts from './Posts.jsx';
import Logout from './useLogout.jsx';
import useProfilePicture from './useProfilePicture.jsx';
import usePosts from './usePosts.jsx';
import { useEffect, useState } from 'react';
import Header from './Header.jsx';

function Home() {
    
    const [loggedInUserId, setLoggedInUserId] = useState(sessionStorage.getItem('userId'));
    const loggedInUsername = sessionStorage.getItem('username');
    const [selection, setSelection] = useState('general');
    const { profilePicture } = useProfilePicture(loggedInUserId);
    const { createPost } = usePosts(loggedInUserId, selection, setSelection);

    const maxLength = 160;
    
    const handleGoogleSignIn = async() => {
        const urlParams = new URLSearchParams(window.location.search);
        const userParam = urlParams.get('user');
        
        if(userParam){
            const user = JSON.parse(decodeURIComponent(userParam));
            
            sessionStorage.setItem('userId', user.user_id);
            sessionStorage.setItem('username', user.username);
            setLoggedInUserId(user.user_id);
        }
    }
    
    /**
     * contenteditable attribute causes the cursor to move to the beginning of the input.
     *  Override this behavior to move the cursor to the end of the input.
     * Add styling for warning message when character limit is reached
    **/
    const handleInput = (event) => {
        
        const warningText = document.getElementById('warning-text');
        if(event.target.innerText.length >= maxLength){
            event.target.innerText = event.target.innerText.substring(0, maxLength);
            warningText.style.visibility = 'visible';
            
           event.target.style.border = "1px solid red";
           const range = document.createRange();
           const selection = window.getSelection();
           if(event.target.childNodes[0] && event.target.childNodes[0] >= event.target.innerText.length){
            range.setStart(event.target.childNodes[0], event.target.innerText.length);
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);
           }
        }
        else{
            event.target.style = "";
            warningText.style.visibility = 'hidden';
        }
        
        //Remove line break element that browsers add using contenteditable attribute
        if(event.target.innerHTML == '<br>'){
            event.target.innerHTML = '';
        }
    }
    
    useEffect(() => {
        if(!loggedInUserId){
            handleGoogleSignIn();
        }
    }, [loggedInUserId]);
    
    if(!loggedInUserId){
        return <div>Loading...</div>
    }
    
    return (
        <div className='home-container'>
            {/** BEGIN NAV(LEFT) SECTION */}
            <div className="nav">
                <div className="title-info">
                    <Header />
                    <Logout />
                </div>
                <div id="navbar">
                    <a href={`http://localhost:5173/profile/${loggedInUserId}/${loggedInUsername}`}>My Profile</a>
                    <a href='#'>Notifications</a>
                    <a href='#'>Messages</a>
                </div>
            </div>
            {/** END NAV(LEFT) SECTION */}

            {/** BEGIN MAIN(CENTER) SECTION */}
            <div className='main-feed'>
                <div className="main-feed-header">
                    <div className='filter-feed'>
                        <input id='general' className='radio' onChange={(e) => setSelection(e.target.id)} type="radio" name='options' autoComplete='off' defaultChecked />
                        <label id='general-label' className='filter-button left-label' htmlFor='general'>General Feed</label>
                        <input id='following' className='radio' onChange={(e) => setSelection(e.target.id)} type="radio" name='options' autoComplete='off' />
                        <label id='following-label' className='filter-button right-label' htmlFor='following'>Following</label>
                    </div>

                    <div className='post-form-group'>
                            <div id='post-profile-picture' className="profile-picture">
                                <Link to={`/profile/${loggedInUserId}/${loggedInUsername}`}>
                                    <img className='profile-picture custom-border-dark' src={profilePicture} alt="post profile picture" />
                                </Link>
                                <span id='post-username'>{loggedInUsername}</span>
                            </div>
                        <form id="create-post" onSubmit={createPost} noValidate>
                            <span name='content' id='contentField' onInput={handleInput} contentEditable='true'></span>
                            <span id="warning-text">Max 160 characters</span>
                            <button className='button' type='submit'>Post</button>
                        </form>
                    </div>

                </div>
                < Posts postType = {selection}/>
            </div>
                {/** END MAIN(CENTER) SECTION */}

                {/** BEGIN NEWS(RIGHT) SECTION */}
                <div className="news">
                    <div className="news-header"></div>
                </div>
                {/** END NEWS(RIGHT) SECTION */}
        </div>
    )
}

export default Home;