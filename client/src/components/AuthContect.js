import React,{ useState, useEffect, createContext} from "react";

export const AuthContext = createContext();
 export function AuthProvider({children}) {
  const[isAuthenticated, setIsAuthenticated]= useState(false)
 
 
  useEffect(()=>{
    const token= localstorage.getItem("token");
    setIsAuthenticated(!!token);

  },[]);
 }