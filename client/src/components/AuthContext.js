/*import React,{ useState, useEffect, createContext, } from "react";

export const AuthContext = createContext();
 export function AuthProvider({children}) {
  const[isAuthenticated, setIsAuthenticated]= useState(!!localStorage.getItem("token"));
 
 
  return(<AuthContext.Provider value ={{ isAuthenticated, setIsAuthenticated}}>
    {children}

    </AuthContext.Provider>)
 };*/