import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import axios from "axios";
// import jwtDecode from "jwt-decode";

const Base_url = process.env.REACT_APP_BACKEND_URL;

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: any; // Decoded JWT token, replace `any` with actual decoded structure
  userData: User | null;
  login: (credentials: { email: string; password: string }) => Promise<{ success: boolean; message: string }>;
  register: (credentials: { name: string; email: string; password: string }) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<any>(null); 
  const [userData, setUserData] = useState<User | null>(null);

  const login = async (credentials: { email: string; password: string }) => {
    try {
      const { data } = await axios.post(`${Base_url}/login`, credentials);

      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);

      // const decodedToken: any = jwtDecode(data.token); // Replace `any` with the actual type for the decoded token
      // if (decodedToken.exp * 1000 < Date.now()) {
      //   throw new Error("Token has expired");
      // }

      // setUser(decodedToken);
      setUserData(data?.user);
      return { success: true, message: data.message };
    } catch (error: any) {
      console.error("Login failed:", error.message);
      return { success: false, message: error.message };
    }
  };

  const register = async (credentials: { name: string; email: string; password: string }) => {
    try {
      const { data } = await axios.post(`${Base_url}/register`, credentials);
      return { success: true, message: data.message };
    } catch (error: any) {
      console.error("Registration failed:", error.response?.data?.message || error.message);
      throw new Error(error.response?.data?.message || "Registration failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setUserData(null);
  };

  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   const storedUser = localStorage.getItem("user");

  //   if (token) {
  //     try {
  //       // const decodedToken: any = jwtDecode(token);

  //       setUser(decodedToken);

  //       if (storedUser) {
  //         setUserData(JSON.parse(storedUser));
  //       }
  //     } catch (error: any) {
  //       console.error("Invalid or expired token:", error.message);
  //       localStorage.removeItem("token");
  //       localStorage.removeItem("user");
  //     }
  //   }
  // }, []);

  return (
    <AuthContext.Provider value={{ user, userData, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
