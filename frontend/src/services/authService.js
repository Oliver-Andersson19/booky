// frontend/src/services/authService.js
export const loginWithGoogle = async (id_token) => {
  const res = await fetch("http://localhost:5000/api/auth/google", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id_token }),
    credentials: "include", // send refresh token cookie
  });

  if (!res.ok) throw new Error("Login failed");

  return res.json(); // returns { accessToken, user }
};



export const refreshAccessToken = async () => {
  const res = await fetch("http://localhost:5000/api/auth/refresh", {
    method: "POST",
    credentials: "include", // sends refresh token cookie
  });

  if (!res.ok) throw new Error("Could not refresh token");
  return res.json(); // returns { accessToken }
};



export const fetchWithToken = async (url, accessToken, options = {}) => {
  options.headers = {
    ...options.headers,
    Authorization: `Bearer ${accessToken}`,
  };

  let res = await fetch(url, options);

  if (res.status === 401) {
    const data = await refreshAccessToken();
    accessToken = data.accessToken;

    options.headers.Authorization = `Bearer ${accessToken}`;
    res = await fetch(url, options);
  }

  return res;
};