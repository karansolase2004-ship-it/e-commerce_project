
export const saveTokens = (token) => {
  localStorage.setItem("access_token", token.access);
  localStorage.setItem("refresh_token", token.refresh);
};

export const clearTokens = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
};

export const getAccessToken = () => {
  return localStorage.getItem("access_token");
};

// Shared promise for token refresh
let refreshPromise = null;

// Generate a new access token using the refresh token
const refreshAccessToken = async () => {

  // If refresh is already running, wait for the same request
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    const refreshToken = localStorage.getItem("refresh_token");

    if (!refreshToken) {
      clearTokens();
      return null;
    }

    try {
      const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

      const response = await fetch(`${BASEURL}/api/token/refresh/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refresh: refreshToken,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        clearTokens();
        return null;
      }

      localStorage.setItem("access_token", data.access);

      return data.access;

    } catch (error) {
      console.error("Token refresh failed:", error);
      return null;
    }
  })();

  try {
    return await refreshPromise;
  } finally {
    refreshPromise = null;
  }
};

// Send API request with automatic token refresh
export const authFetch = async (url, options = {}) => {

  const makeRequest = (token) => {
    const headers = options.headers ? { ...options.headers } : {};

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    headers["Content-Type"] = "application/json";

    return fetch(url, {
      ...options,
      headers,
    });
  };

  let token = getAccessToken();

  let response = await makeRequest(token);

  // If access token expires, refresh and retry
  if (response.status === 401) {

    token = await refreshAccessToken();

    if (token) {
      response = await makeRequest(token);
    }
  }

  return response;
};
