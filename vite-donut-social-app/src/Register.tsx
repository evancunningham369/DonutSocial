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
    <>
    <h1>Register/Log-In</h1>
    <h2>{serverResponse}</h2>
      <form action="" onSubmit={handleSubmit}>
        <label htmlFor="">Username: </label>
        <input name='username' value='user1' type="text" />
        <label htmlFor="">Password: </label>
        <input name='password' value='123' type="password" />
        <button name='register' type='submit' onClick={(e) => setButtonClicked(e.target.name)}>Register</button>
        <button name='login' type='submit' onClick={(e) => setButtonClicked(e.target.name)}>Log-In</button>
      </form>
    </>
  )
}

export default Register;
