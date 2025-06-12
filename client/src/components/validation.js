export const validateForm =(formData) =>{
  console.log("validateForm received:", formData);

  if(!formData){
    return{ valid:false, message:"Missing data"}
  }
  const { firstname, surname, email, password} = formData;
  if (!email.trim() || !password.trim()){
    return {valid: false, message:"Email and password required"};
 
 }
 //signup validation 
  if (
    ("firstname" in formData && !firstname.trim()) || 
    ("surname" in formData && !surname.trim())
 ){
  return{valid: false, message:"All fields are required."};
  }

//email regex
  const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  if (!emailRegex.test(email)){
   return{valid: false, message:"Please enter a valid email adress."};
    
  }

//password
  const passwordRegex = /^(?=.*[A-z])(?=.*\d).{8,}$/;
  if (!passwordRegex.test(password)){
     return{valid: false, 
      message:
      'Pasword must be atleast 8 characters, include uppercase, lowercase and a number.'};
          
  }
//Pass
  
  return {valid:true, message:""};

};
