const { BASE_URL } = process.env;

export const register = async(user) => {
    let serverResponse = await fetch(`${BASE_URL}/register`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(user)
    });
    return serverResponse;
}

export const login = async(user) => {
    let serverResponse = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(user)
    });
    return serverResponse;
}

export const logout = async() => {
    let serverResponse = await fetch(`${BASE_URL}/logout`);
    return serverResponse;    
}

export const google_login = async() => {
  window.location.href = `${BASE_URL}/auth/google`;
}

export const upload_profile_picture = async(data) => {
  
  let serverResponse = await fetch (`${BASE_URL}/upload-profile-picture`, {
    method: "POST",
    body: data
  });
  
  return serverResponse.json();
}

export const get_profile_picture = async(userId) => {
  let serverResponse = await fetch (`${BASE_URL}/profile-picture/${userId}`);
  
  if(!serverResponse.ok){
    return '/src/public/donut.jpg';
  }
  return serverResponse.json();
}

export const delete_profile_picture = async(userId) => {
  let serverResponse = await fetch (`${BASE_URL}/delete-profile-picture/${userId}`, {
    method: "POST"
  });
  return serverResponse.json();
}

export const user_following_profile = async(userId, profileId) => {
  let serverResponse = await fetch(`${BASE_URL}/user-following/${userId}/${profileId}`, {
    method: 'POST',
    headers: {"Content-Type": "application/json"}
  });
  return serverResponse.json();
}

export const get_profile_info = async(userId) => {
  let serverResponse = await fetch(`${BASE_URL}/profile-info/${userId}`);
  return serverResponse;
}