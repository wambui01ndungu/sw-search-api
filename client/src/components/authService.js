//authService.js

import BASE_URL from './config';

import { maskSensitiveData } from './utils';  


export async function signup(formData) {
  console.log("Sending signup data:", maskSensitiveData(formData));
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
export async function login(formData) {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': "application/json"
    },
    credentials: "include",
    body: JSON.stringify(formData)
  });

  const data = await response.json();

  if (!response.ok) {
    const message = data.message || "login failed";
    throw new Error(message);
  }

  if (data.access_token) {
    localStorage.setItem("access_token", data.access_token);
  } else {
    console.warn("No access_token found in response");
  }

  return data;
}
