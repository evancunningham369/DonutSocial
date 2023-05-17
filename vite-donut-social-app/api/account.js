const { BASE_URL } = process.env;

export const register = async(user) => {
    let serverResponse = await fetch(`${BASE_URL}/register`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(user)
    });
    return serverResponse.json();
}

export const login = async(user) => {
    let serverResponse = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(user)
    });
    return serverResponse.json();
}