import { createContext, useContext, useState } from "react";
import { loginUser, registerUser } from "../api/authApi";

const AuthContext = createContext(null);

const TOKEN_KEY = "parammart_token";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(
    () => localStorage.getItem(TOKEN_KEY)
  );

  const login = async (credentials) => {
    const response = await loginUser(credentials);

    if (!response?.token) {
      throw new Error("Authentication token was not received.");
    }

    localStorage.setItem(TOKEN_KEY, response.token);
    setToken(response.token);

    return response;
  };

  const register = async (data) => {
    const response = await registerUser(data);

    return response;
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
  };

  const isAuthenticated = Boolean(token);

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}