//signup.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { validateForm } from "./validation";
import { FaTruckLoading } from "react-icons/fa";
import { signup } from "./authService";



function Signup () {
  const navigate = useNavigate();
  const [error, setError]= useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData]= useState({
    firstname:"",
    surname:"",
    email:"",
    password:"",
    
    

  })
  const API_URL = process.env.REACT_APP_API_URL;
  

 
//update state
const handleChange=(e)=>{
  const{name, value} = e.target;
  setFormData((prev)=>({
    ...prev,
    [name]:value
  }));

};
const formatName =(name) =>
  name ? name.trim().charAt(0).toUpperCase()+name.trim().slice(1).toLowerCase():"";

//prevent reloading by default
  const handleSubmit =async(e) =>{
    e.preventDefault();
    

  const normalizedFormData = {
      firstname: formatName(formData.firstname),
      surname: formatName(formData.surname),
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
};
  //validate before sending to server 
  const{valid, message}= validateForm(normalizedFormData);
    if(!valid){
      setError(message);
      return;
    };

     setLoading(true);
     setError("");
   

    try {
      const data =await signup(normalizedFormData);
      console.log("signup  sucessfull", data)

      localStorage.setItem("user", JSON.stringify(data.email));
      navigate("/login")
  }


  catch (error)  {
  console.error("Unexpected error during signup:", error);
  setError("A network error occurred. Please try again.");
  } finally{
    setLoading(false);
  }

  };

  return(
  <div className= "signup-container">
    <div className="signup-form-container">
      <h2> Signup</h2>
      <form onSubmit={handleSubmit}>
        {error && <div className="error" >{error}</div>}
        <div>
          <label htmlFor="firstName">firstname</label>
            <input
              id="firstname"
              type="text"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              disabled={loading}
            />
        </div>
        <div>
          <label htmlFor="surname">Surname</label>
          <input
          id="surname"
          type= "text"
          name="surname"
          value={formData.surname}
          onChange={handleChange}
          disabled={loading}

          />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input
          id="email"
          type="text"
          name="email"
          value={formData.email}
          onChange={handleChange}
          disabled={loading}


          />
        </div>
        <div>
          <label htmlFor=" password">Password</label>
          <input
          id="password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          disabled={loading}


          />
         
        </div>
        
        <button type="submit" disabled={loading}>{loading ? <><FaTruckLoading/>Signing up ...</>:"signup"} </button>

        
      </form>
      <div  className= "signup_footer">
        <p> <Link to ="/login"> Login?</Link>
        </p>

      </div>
    </div>
   
    

  </div>)

};

export default Signup;