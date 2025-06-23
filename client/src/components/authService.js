//authService.js

import BASE_URL from './config';

export async function signup(formData) {
  const response = await fetch(`${BASE_URL}/auth/signup`,{
  method:'POST',
  headers:{
    'Content-Type': "application/json"
  },
  credentials:"include",
  body:JSON.stringify(formData)

});

const data = await response.json();

if (!response.ok){
  const message =data.message || "signup failed";
  throw new Error(message)
}
return data;
}