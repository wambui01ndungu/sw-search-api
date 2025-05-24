import React, { useState } from "react"
import { Link } from "react-router-dom";



function Signup () {
  const [formData, setFormData]= useState({
    firstName:"",
    surname:"",
    email:"",
    password:"",
    loginOption:""
    

  })
  const API_BASE_URL = "http://localhost:3006";

 // const validate form =() =>{

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
   
    try {
      const response =  await fetch(`${API_BASE_URL}/signup`,{
      method:'POST',
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify(formData)
    
    });

    const data = await response.json();

    if (response.ok){
      alert("signup sucessful!");
    } else{
      alert("signup failed:"+ (data.message || 'unknown error'));
    }
  }
    catch (error){
      alert("something went wrong!")


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
              name="firstName"
              value={formData.firstName}
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