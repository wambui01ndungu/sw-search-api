const API_URL = process.env.REACT_APP_API_URL;

export async function signup(formData) {
  const response = await fetch(`${API_URL}/auth/signup`,{
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