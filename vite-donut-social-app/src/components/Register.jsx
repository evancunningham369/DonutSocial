import { useEffect, useState } from 'react'
import { register, login, google_login} from '../../api/account.js';
import { useNavigate } from 'react-router-dom';
import Header from './Header.jsx';

function Register() {
  const [buttonClicked, setButtonClicked] = useState("");
  const [serverResponse, setServerResponse] = useState("");
  const [isAlertVisible, setAlertVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if(serverResponse) {
      setAlertVisible(true);
      const timer = setTimeout(() => {
        setServerResponse("");
        setAlertVisible(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  },[serverResponse]);

/**
 * 
 * @param {React.FormEvent<HTMLFormElement} event 
 * @returns 
 */

  async function handleSubmit(event){
    
    event.preventDefault();
    console.log('validating...');
    
    const usernameRegEx = /^[A-Za-z]+\d+$/;
    const passwordRegEx = /^(?=[A-Za-z])(?=.*\d)(?=.*[!#@\\$()\-\\%&])[A-Za-z\d#$()\-\\%&]+/;
    const { username , password } = event.currentTarget;

    document.getElementById('password-error-message').innerHTML ='';
    document.getElementById('username-error-message').innerHTML ='';
    
    let validUsername = false;
    let validPassword = false;
    
    // Validate username 

    //Check if username is empty
    if(username.value.length === 0){
      document.getElementById('username-error-message').innerHTML ='Username cannot be empty';
    }
    //Check if username matches regular expression
      else if(!usernameRegEx.test(username.value)){
        document.getElementById('username-error-message').innerHTML ='Username must begin with a letter and have at least one number';
      }
      // Username is valid
      else{
        validUsername = true;
      }

      // Validate password

      // Check if password is empty
      if(password.value.length === 0){
        document.getElementById('password-error-message').innerHTML ='Password cannot be empty';
      }
      // Check if password matches regular expression
      else if(!passwordRegEx.test(password.value)){
        document.getElementById('password-error-message').innerHTML ='Password must be at least 6 characters, and must start with a letter, at least 1 number, and at least 1 special[! @ # $ ( ) \\ - % &] character';
      }
      // Password is valid
      else{
        validPassword = true;
      }

    // Proceed if username and password are valid
    if(validUsername && validPassword){

      let user = {
        username: username.value,
        password: password.value
      }
      
      let response = buttonClicked === "register" ? await register(user) : await login(user);
      let data = await response.json();
  
      if(!response.ok){
        setServerResponse(data.message);
      }
      else{
        
        sessionStorage.setItem("userId", data.userId);
        sessionStorage.setItem("username", data.username);
  
        navigate('/home');
      }
    }
    
  }

  const handleGoogleSignIn = () => {
    try {
      google_login();
      
    } catch (error) {
      serverResponse(error);
    }
  }

  return (
    <div className="form-container">
      <form className='form-signin' onSubmit={handleSubmit} noValidate>
        <div className='signin-box'>
        <Header />
          <div className="inputFields">
            <h1 id='register-title'>Welcome!</h1>
            <label htmlFor="usernameField">Username</label>
            <input  id='usernameField' name='username' type="text" placeholder='Enter your username...' autoComplete='off' maxLength={20} required/>
            <span id="username-error-message"></span>
            <label htmlFor="passwordField">Password</label>
            <input  id='passwordField' name='password' defaultValue='a1!' type="text" autoComplete='off' placeholder='Enter your password...' required />
            <span id="password-error-message"></span>
          </div>
          <div id="submit-buttons">
            <button id='login' className='button' name='login' type='submit' onClick={(e) => setButtonClicked(e.currentTarget.name)}>Log-In</button>
            <button className='google-btn button' name='google-login' type='button' onClick={handleGoogleSignIn}><img src="/google/g_icon.png" alt="g-icon" className='google-icon' />Sign in with Google</button>
            <button id='register' className='button' name='register' type='submit' onClick={(e) => setButtonClicked(e.currentTarget.name)}>Register</button>
          </div>
        <div role='alert' style={{visibility: isAlertVisible ? 'visible': 'hidden'}}id='alert'>
          {serverResponse}
        </div>
        </div>
      </form>
      <div className='background-image'>
        <img src="/sprinkles-8831931_1920.png" alt="sprinkles background" style={{display:'none'}}/>
      </div>
    </div>
  )
}

export default Register;
