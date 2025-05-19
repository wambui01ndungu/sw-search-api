import React from "react";

import Signup from "./components/Signup";
import SearchBar from "./components/Search bar";
import Login from "./components/login";

function App(){
  return(
   <div className="App">
       
    <div>
      <Signup/>
         
     </div>
     
     <div>
      <Login/>
     </div>


   </div>
  );

};

export default App;