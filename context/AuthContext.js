"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("taskforgeUser");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const login = (token) => {
    const decoded = JSON.parse(atob(token.split(".")[1]));
    const userData = { token, role: decoded.role };
    localStorage.setItem("taskforgeUser", JSON.stringify(userData));
    setUser(userData);
    router.push("/tasks");
  };

  const logout = () => {
    localStorage.removeItem("taskforgeUser");
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
