import { useEffect, useState } from 'react'
import { register, login, google_login} from '../../api/account.js';
import { useNavigate } from 'react-router-dom';

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
      }, 3000);

      return () => clearTimeout(timer);
    }
  },[serverResponse]);

  async function handleSubmit(event){
    event.preventDefault();

    const { username , password } = event.currentTarget;

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

  const handleGoogleSignIn = () => {
    try {
      google_login();
      
    } catch (error) {
      serverResponse(error);
    }
  }

  return (
    <div className="form-container">
        <form className='text-center form-signin' onSubmit={handleSubmit}>
          <h1 id='register-title' className='h3 m-3 fw-normal'>Register/Log-In</h1>
          <div className='form-floating'>
            <input className='form-control' id='floatingUsername' name='username'  defaultValue='user1' type="text" placeholder='username' />
            <label className='floating-input' htmlFor="floatingUsername">Username</label>
          </div>
          <div className='form-floating'>
            <input className='form-control' id='floatingPassword' name='password'  defaultValue='123' type="password" placeholder='password' />
            <label className='floating-input' htmlFor="floatingPassword">Password</label>
          </div>
          <div id="submit-buttons">
            <button className='btn btn-primary' name='register' type='submit' onClick={(e) => setButtonClicked(e.currentTarget.name)}>Register</button>
            <button className='btn btn-primary' name='login' type='submit' onClick={(e) => setButtonClicked(e.currentTarget.name)}>Log-In</button>
            <button className='btn btn-primary' name='google-login' type='button' onClick={handleGoogleSignIn}>Google Log-In</button>
          </div>
          <div style={{visibility: isAlertVisible ? 'visible': 'hidden'}}id='alert' className='alert alert-danger' role='alert'>
            {serverResponse}
          </div>
        </form>
    </div>

  )
}

export default Register;
