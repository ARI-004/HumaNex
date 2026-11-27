// Frontend Authentication & API service for HumaNex
const API_BASE_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api/auth` 
  : "http://localhost:5000/api/auth";

export const authStorage = {
  getToken: () => localStorage.getItem("humanex_token"),
  setToken: (token) => {
    if (token) localStorage.setItem("humanex_token", token);
  },
  removeToken: () => localStorage.removeItem("humanex_token"),
  
  getUser: () => {
    try {
      const data = localStorage.getItem("humanex_user");
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },
  setUser: (user) => {
    if (user) localStorage.setItem("humanex_user", JSON.stringify(user));
  },
  removeUser: () => localStorage.removeItem("humanex_user"),
  
  clear: () => {
    localStorage.removeItem("humanex_token");
    localStorage.removeItem("humanex_user");
  }
};

/**
 * Register a new user
 */
export async function signupUser({ name, email, password, role, extra }) {
  try {
    const response = await fetch(`${API_BASE_URL}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ name, email, password, role, extra }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Registration failed");
    }

    if (data.token) authStorage.setToken(data.token);
    if (data.user) authStorage.setUser(data.user);

    return data;
  } catch (error) {
    throw error;
  }
}

/**
 * Log in an existing user
 */
export async function loginUser({ email, password, role }) {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email, password, role }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    if (data.token) authStorage.setToken(data.token);
    if (data.user) authStorage.setUser(data.user);

    return data;
  } catch (error) {
    throw error;
  }
}

/**
 * Log out user
 */
export async function logoutUser() {
  try {
    await fetch(`${API_BASE_URL}/logout`, {
      method: "POST",
      credentials: "include",
    });
  } catch (e) {
    console.warn("Logout error:", e);
  } finally {
    authStorage.clear();
  }
}

/**
 * Fetch authenticated user profile
 */
export async function fetchCurrentUser() {
  const token = authStorage.getToken();
  if (!token) return null;

  try {
    const response = await fetch(`${API_BASE_URL}/me`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
      credentials: "include",
    });

    if (!response.ok) {
      authStorage.clear();
      return null;
    }

    const data = await response.json();
    if (data.user) {
      authStorage.setUser(data.user);
      return data.user;
    }
    return null;
  } catch (error) {
    console.warn("Check auth error:", error);
    return null;
  }
}
