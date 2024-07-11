import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userType, setUserType] = useState(null);

  const login = (type) => {
    setLoggedIn(true);
    setUserType(type);
  };

  const logout = () => {
    setLoggedIn(false);
    setUserType(null);
  };

  return (
    <AuthContext.Provider value={{ loggedIn, userType, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
