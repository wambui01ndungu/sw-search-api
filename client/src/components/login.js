import React, {useState,}from "react";
import { useNavigate} from"react-router-dom";



function Login(){
  const [loginData, setLoginData] = useState({
    email:"", 
    password:""
  });
  

  const[error, setError]= useState("");
  const navigate = useNavigate();
 
 
  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3006";

  const handleChange=(e)=>{
    setLoginData({
      ...loginData,
      [e.target.name]:e.target.value
    });
  };
    

  const handleSubmit= async (e)=>{
    e.preventDefault();
    setError("");
  
    try {
        const response = await fetch(`${API_BASE_URL}/login`,{
          method:"POST",
          headers: {
            'Content-Type':'application/json'
             },
             body:JSON.stringify({

              email:loginData.email,
               password:loginData.password
              })
        });
       

        if(!response.ok){
          const data = await response.json();
          throw new Error(data.message ||"login failed");
        }
        const data = await response.json();

        localStorage.setItem("token", data.access_token);
        localStorage.setItem("username", data.name || "User");

        
        
        //navigation Route

        navigate("/Search");
        alert("Login successful!")
    
  
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
      <label>Email</label>
      <input
        name="email"
        placeholder=""
        value={loginData.email}
        onChange={handleChange}
      />
     </div> 
     <div>  
      <label>Password</label>
      <input
        name="password"
        placeholder=""
        type="password"
        value={loginData.password}
        onChange={handleChange}
      />
      </div>

      
       <button>submit</button>
     

    </form>
    </div>
  </div>
 );
};
export default Login;