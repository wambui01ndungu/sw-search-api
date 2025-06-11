import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";



function Signup () {
  const navigate = useNavigate();
  const [error, setError]= useState("");
  const [formData, setFormData]= useState({
    firstname:"",
    surname:"",
    email:"",
    password:"",
    
    

  })
  const API_URL = process.env.REACT_APP_API_URL;
  

 const validateForm =() =>{
    const { firstname, surname, email, password} = formData;
    if (!firstname.trim() || !surname.trim() || !email.trim() || !password.trim()){
    setError("All fields are required.");
    return false;
   }

  //email regex
    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!emailRegex.test(email)){
      setError("Please enter a valid email adress.");
      return false;
    }

  //password
    const passwordRegex = /^(?=.*[A-z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)){
      setError('Pasword must be atleast 8 characters, include uppercase, lowercase and a number.');
        return false;
      
    }
  //Pass
    setError("");
    return true;

 };

//update state
const handleChange=(e)=>{
  const{name, value} = e.target;
  setFormData((prev)=>({
    ...prev,
    [name]:value
  }));

};

//prevent reloading by default
  const handleSubmit =async(e) =>{
    e.preventDefault();
    
    //validate before sending to server
   
    if(!validateForm()) return;


    try {
      const response =  await fetch(`${API_URL}/signup`,{
      method:'POST',
      headers:{
        "Content-Type":"application/json"
      },
      credentials:"include",
      body:JSON.stringify(formData)
    
    });

    const data = await response.json();

    console.log("Raw response:", response);
    console.log("Parsed data:", data);  


    if (response.ok && data.token){
      console.log ("signup sucessful!");

      //redirect to log in
      navigate("/login");

    } else{
      console.warn( "signup failed:", data.message);
      setError(data.message || "Signup failed");
      alert("user already exist")
    }
  }
  catch (error)  {
  console.error("Unexpected error during signup:", error);
  alert("An expected error occured. see console for details");
  }

  };

  return(
  <div className= "signup-container">
    <div className="signup-form-container">
      <h2> Signup</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>First Name</label>
            <input
              type="text"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
            />
        </div>
        <div>
          <label>Surname</label>
          <input
          type= "text"
          name="surname"
          value={formData.surname}
          onChange={handleChange}

          />
        </div>
        <div>
          <label>Email</label>
          <input
          type="text"
          name="email"
          value={formData.email}
          onChange={handleChange}

          />
        </div>
        <div>
          <label>Password</label>
          <input
          type="text"
          name="password"
          value={formData.password}
          onChange={handleChange}

          />
        {error && <p style={{ color: "red" }}>{error}</p>}  
        </div>
        
        <button type="submit">submit</button>

        
      </form>
      <div  className= "signup_footer">
        <p> <Link to ="/login"> Login?</Link>
        </p>

      </div>
    </div>
   
    

  </div>)

};

export default Signup;