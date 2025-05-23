import React from "react";
import{Route, Routes,BrowserRouter as router, Link, useNavigate, Router} from "react-router-dom";

import Signup from "./components/Signup";
import Search from "./components/Search";
import Login from "./components/login";
import "./App.css";


function App(){
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  return(
    
    
      <Routes>
        <Route path="/" element ={<Signup/>}/>
        <Route path="/login" element ={<Login/>}/>
        <Route path="/search" element ={<Search/>}/>

      </Routes>


    
     
  );

};

export default App;