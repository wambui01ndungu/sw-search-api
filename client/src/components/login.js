import React, {useState}from "react";

function Login(){
  const [loginData, setLoginData] = useState({email:"", password:""})

  const handleChange=(e)=>{
    const[name,value]= e.target;
    setLoginData((prev)=>({
      ...prev,
      [name]:value

    }));
  };
 
    

const handleSubmit=(e)=>{
  e.preventDefault();
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