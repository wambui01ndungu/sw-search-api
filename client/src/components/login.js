//login.js
import React, {useState,}from "react";
import { useNavigate} from"react-router-dom";
import {validateForm} from "./validation"
import { login } from "./authService"; 


function Login(){
  const [loginData, setLoginData] = useState({
    email:"", 
    password:""
  });
  

  const[error, setError]= useState("");
  const navigate = useNavigate();
 
 
 

  const handleChange=(e)=>{
    setLoginData({
      ...loginData,
      [e.target.name]:e.target.value
    });
  };
    

  const handleSubmit= async (e)=>{
    e.preventDefault();

    setError("");

    //validate inputs
  const { valid, message } = validateForm(loginData);
    if (!valid) {
      setError(message);
      return;
    }
    
  
    try {
      console.log("sending login request with:", loginData);
        const data= await login(loginData);
          
        localStorage.setItem("username", data.name || "User");

               
        //navigation Route

        navigate("/search");
       // alert("Login successful!")
    
      }catch (error) {
        console.error("Error logging in:", error.message);
        setError(error.message);
      }
    };






return(
  <div className="login-container">
    <div className="login-card" ><h2> Login</h2>
    <form onSubmit={handleSubmit}>
      <div>
      <label htmlFor="email">Email</label>
      <input
        id ="email"
        name="email"
        placeholder=""
        value={loginData.email}
        onChange={handleChange}
      />
     </div> 
     <div>  
      <label htmlFor="">Password</label>
      <input
        id="password"
        name="password"
        placeholder=""
        type="password"
        value={loginData.password}
        onChange={handleChange}
      />
      </div>

      
       <button>login</button>
     

    </form>
    </div>
  </div>
 );
};
export default Login;