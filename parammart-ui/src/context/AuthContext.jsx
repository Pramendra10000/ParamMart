import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  loginUser,
  registerUser,
} from "../api/authApi";

import axiosClient from "../api/axiosClient";

const AuthContext = createContext(null);

const TOKEN_KEY = "parammart_token";

export function AuthProvider({ children }) {

  const [token, setToken] = useState(
    () => localStorage.getItem(TOKEN_KEY)
  );

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(
    Boolean(localStorage.getItem(TOKEN_KEY))
  );


  // =========================================================
  // FETCH CURRENT USER
  // =========================================================

  const fetchCurrentUser = async () => {

    try {

      const response = await axiosClient.get("/user/me");

      console.log("Current logged-in user:", response.data);

      setUser(response.data);

      return response.data;

    } catch (error) {

      console.error(
        "Failed to fetch current user:",
        error
      );

      localStorage.removeItem(TOKEN_KEY);

      setToken(null);
      setUser(null);

      throw error;

    } finally {

      setLoading(false);
    }
  };


  // =========================================================
  // WHEN TOKEN EXISTS
  // =========================================================

  useEffect(() => {

    if (!token) {

      setLoading(false);
      setUser(null);

      return;
    }

    fetchCurrentUser();

  }, [token]);


  // =========================================================
  // LOGIN
  // =========================================================

  const login = async (credentials) => {

    const response = await loginUser(credentials);

    if (!response?.token) {

      throw new Error(
        "Authentication token was not received."
      );
    }

    localStorage.setItem(
      TOKEN_KEY,
      response.token
    );

    setToken(response.token);

    return response;
  };


  // =========================================================
  // REGISTER
  // =========================================================

  const register = async (data) => {

    const response = await registerUser(data);

    return response;
  };


  // =========================================================
  // LOGOUT
  // =========================================================

  const logout = () => {

    localStorage.removeItem(TOKEN_KEY);

    setToken(null);
    setUser(null);
    setLoading(false);
  };


  // =========================================================
  // ROLE CHECK
  // =========================================================

  const hasRole = (role) => {

    if (!user?.role) {
      return false;
    }

    return user.role === role;
  };


  // =========================================================
  // PERMISSION CHECK
  // =========================================================

  const hasPermission = (permission) => {

    if (!user?.permissions) {
      return false;
    }

    return user.permissions.includes(permission);
  };


  // =========================================================
  // ANY PERMISSION CHECK
  // =========================================================

  const hasAnyPermission = (permissions = []) => {

    return permissions.some(
      (permission) =>
        user?.permissions?.includes(permission)
    );
  };


  // =========================================================
  // AUTHENTICATION STATUS
  // =========================================================

  const isAuthenticated =
    Boolean(token && user);


  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        isAuthenticated,

        login,
        register,
        logout,

        hasRole,
        hasPermission,
        hasAnyPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}


export function useAuth() {

  return useContext(AuthContext);
}