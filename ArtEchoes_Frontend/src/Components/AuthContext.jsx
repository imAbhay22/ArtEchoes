import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
axios.defaults.baseURL = "http://192.168.1.100:5000";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Add axios interceptor in AuthProvider to include token in requests so that we don't have to manually add it in every request, it is used to authenticate the user, so that the user can access the protected routes without it anyone with userId can access the protected routes which is not secure.
  useEffect(() => {
    axios.interceptors.request.use((config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }, []);

  // Load authentication info from localStorage on initial mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");
    const userId = localStorage.getItem("userId");
    const username = localStorage.getItem("username");

    // In AuthProvider's useEffect
    if (token && email && userId && username) {
      // Add token validation check
      axios
        .post("/api/validate-token", { token })
        .then(() => {
          setUser({ token, email, userId, username });
          setIsAuthenticated(true);
        })
        .catch(() => {
          // On Invalid token, clear storage
          logout();
        });
    }
  }, []);

  const login = (token, email, userId, username) => {
    localStorage.setItem("token", token);
    localStorage.setItem("email", email);
    localStorage.setItem("userId", userId);
    localStorage.setItem("username", username);
    setUser({ token, email, userId, username });
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, logout, user, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
