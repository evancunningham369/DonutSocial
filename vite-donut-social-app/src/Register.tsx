import { useState } from 'react'
import { register, login } from '../api/account.js';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [buttonClicked, setButtonClicked] = useState("");
  const [serverResponse, setServerResponse] = useState("");
  const navigate = useNavigate();
  
  async function handleSubmit(e){
    e.preventDefault();

    const { username, password } = e.target;

    let user = {
      username: username.value,
      password: password.value
    }

    let result = buttonClicked === "register" ? await register(user) : await login(user);
    const response = await result.json();

    if(result.ok){
      sessionStorage.setItem('userId', response.userId);
      navigate('/home');
    }
    
    setServerResponse(response);
  }

  return (
    <div className="page">
      <div className='register-form'>
        <h1 id='register-title'>Register/Log-In</h1>
          <form className='register-field' action="" onSubmit={handleSubmit}>
            <label id='username' htmlFor="username">Username: 
              <input name='username' defaultValue='user1' type="text" />
            </label>
            <label id='password' htmlFor="password">Password: 
              <input name='password' defaultValue='123' type="password" />
            </label>
            <div id="submit-buttons">
              <button name='register' type='submit' onClick={(e) => setButtonClicked(e.target.name)}>Register</button>
              <button name='login' type='submit' onClick={(e) => setButtonClicked(e.target.name)}>Log-In</button>
            </div>
            <h2 id='register-response'>{serverResponse}</h2>
          </form>
      </div>
    </div>

  )
}

export default Register;
