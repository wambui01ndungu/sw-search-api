import React, {useState, useEffect}from "react";
import {link, useNavigate} from"react-router-dom";

function Login(){
  const [loginData, setLoginData] = useState({
    email:"", 
    password:""
  });
  

  const[error, setError]= useState("");
  const navigate = useNavigate();
  const API_BASE_URL = process.env.REACT_APP_API_URL;

  
  const handleChange=(e)=>{
    setLoginData({
      ...loginData,
      [e.target.name]:e.target.value
    });
  };
    


  const handleSubmit= async (e)=>{
    e.preventDefault();
    setError();
  
    try {
        const response = await fetch(`${API_BASE_URL}/login`,{
          method:"POST",
          headers: {
            'Content_Type':'application.json'
             },
             body:JSON.stringify({
              email:loginData.email,
               password:loginData.password
              })
        });
        const data = await response.json();

        if(!response.ok){
          throw new Error(data.message ||"login failed")
        }

        localStorage.setItem("token", data.access_token);
        localStorage.setItem("username", data.name || "User");
    
  
      }catch (error) {
        console.error("Error logging in:", error.message);
      }
    };






return(
  <div>
    <h2> Login</h2>
    <form onSubmit={handleSubmit}>
      <input
        name="email"
        placeholder="email"
        value={loginData.email}
        onChange={handleChange}
      />

      <input
        name="password"
        placeholder="password"
        type="password"
        value={loginData.password}
        onChange={handleChange}
      />
      <button>submit</button>


    </form>
  </div>
 );
};
export default Login;