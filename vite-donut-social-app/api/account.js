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

export const upload_profile_picture = async(data) => {
  let serverResponse = await fetch (`${BASE_URL}/upload-profile-picture`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(data)
  });
  return serverResponse.json();
}

export const get_profile_picture = async(userId) => {
  let serverResponse = await fetch (`${BASE_URL}/profile-picture/${userId}`);
  return serverResponse.json();
}

export const remove_profile_picture = async(profilePictureId) => {
  let serverResponse = await fetch (`${BASE_URL}/remove-profile-picture/${profilePictureId}`, {
    method: "POST"
  });
  return serverResponse.json();
}