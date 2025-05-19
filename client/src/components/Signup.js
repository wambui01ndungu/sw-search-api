import React, { useState } from "react"


function Signup () {
  const [formData, setFormData]= useState({
    firstName:"",
    surname:"",
    email:"",
    password:"",
    loginOption:""
    

  })

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
  const handleSubmit =(e) =>{
    e.preventDefault();
    console.log(formData)

  }

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
    </div>
   
    

  </div>)

};

export default Signup;