import React from "react";

import Signup from "./components/Signup";
import Search from "./components/Search";
import Login from "./components/login";
import "./App.css";

function App(){
  return(
   <div className="App">
       
    <div>
      <Signup/>
         
     </div>
     
     <div>
      <Login/>
     </div>
     <div>
      <Search/>
     </div>


   </div>
  );

};

export default App;