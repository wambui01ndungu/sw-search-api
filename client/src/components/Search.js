//search.js
import React, { useEffect, useState } from "react";
import { FaSearch } from 'react-icons/fa';
import ResultBox from "./Result";

import BASE_URL from "./config";

function Search(){
  //const [results, setResults] = useState ([]);
  const[query, setQuery]=useState("");
  const [loading, setLoading] =useState(false);
  const[ suggestions, setSuggestions]= useState([]);
  const [error, setError]=useState(null)
  const[selectedPerson , setSelectedPerson]=useState(null)
  const [token , setToken]= useState(()=> localStorage.getItem("access_token"));
  const[loadingMessage, setLoadingMessage]= useState("");
  const API_URL = BASE_URL;
  console.log("API_URL:", API_URL);

  

const handleChange = (e) =>{
  const newQuery = e.target.value;
  setQuery(newQuery);
  setSelectedPerson(null);
  setError(null);
  };

const handleSuggestionClick=(suggestion)=>{
    setQuery(suggestion.name);
    setSuggestions([]);
    setSelectedPerson(suggestion);
    
  };


const fetchFromBackend = async(query) => {
  const storedToken = localStorage.getItem("access_token");
 
  
  //check cache
  const cacheKey =`suggestions_${query.toLowerCase()}`;
  const cached = localStorage.getItem(cacheKey);
  if (cached){
    try{
      return JSON.parse(cached);
    }catch (err){
      console.error("Failed to parse cached data", err);
    }

  }

  if(!query.trim() || !storedToken) {
    console.warn("missing query or token",{query, token:storedToken});
    return null;}

  try{
      const res= await fetch(`${API_URL}/search?query=${query}`,{
        method:"GET",
        headers:{
          "Content-Type":"application/json",
        
        },
        credentials:"include"

      });
      if (!res.ok){
        const errorData = await res.json();
        console.error("Backend error", errorData);
        return null;
      }

      const data = await res.json();
      const results= data.results || [];

      //catche the results
      localStorage.setItem(cacheKey, JSON.stringify(results));
      return results;
      
    } catch(err){
      console.error("error feching from backend",err);
      return null;
    }


  };

const handleSearchClick= async ()=>{
  setLoading(true);
  setLoadingMessage("Searching...")

  const results = await fetchFromBackend(query);

  setLoading(false);
  setLoadingMessage("");

  if (results && results.length > 0) {
    setSelectedPerson(results[0]); // show the first matching person
  } else {
    setSelectedPerson(null);
    alert("No match found");
  }
      
  };
  
  //sync token from local storage
useEffect(()=>{
  
    const storedToken = localStorage.getItem("access_token");
    if(!storedToken){
      console.warn("Token not found in local st")
    }
   
      setToken(storedToken);
    

},[]);



//Debounce suggestions from backend
useEffect(()=>{ 

    if(!token || query.length <=1){
      console.warn('debounce skipped due to missing token or short query', {query, token});
      setSuggestions([]);
      setLoading(false);
      setLoadingMessage("")
      return;
    }
    const delayBounce=setTimeout(async()=> {
      setLoading(true);
      setLoadingMessage("Searching Suggestions...");
      console.log("Debounced suggestion fetch for query:", query);
    try{

      const results = await fetchFromBackend(query);
      setLoading(false);
      
      if (results)  {
        setSuggestions(results);
             setError(null); 
      } else{
        setSuggestions([]);
        setError("could not fetch suggestions.");
      }}
      catch (err){
        console.error("Debaounce fetch error", err);
        setSuggestions([]);
        setError("Error during suggestion fetch")
      }finally{
        setTimeout(()=>{
          setLoading(false);
          setLoadingMessage("")
        },500);
      }

      }, 300);
      
    return () => clearTimeout (delayBounce);
},   [query, token]);



return(
  <div className= "search-container">
     
      <input
      type="text"
      placeholder="search..."
      value={query}
      onChange={handleChange}
      /> 
      {loadingMessage && <div style ={{color:"grey", fontSize:"0.8rem", marginTop:"4px",fontStyle:"italic"}}> {loadingMessage}</div>}
      <FaSearch
      className="search-icon"
      onClick={handleSearchClick}
  />
    {error && 
    (<p style={{color:"red", fontSize:"0.8 rem", marginTop:"5px"}}>{error}</p>)}
{/*drop down suggestions*/}

    {suggestions.length >0 && (
      <ul className="Suggestion_List">
        {suggestions.map((suggestion, idx)=>(
          <li 
          key ={idx}
          onClick={()=>handleSuggestionClick(suggestion)}
          style={{cursor:"pointer"}}
          
          >
            {suggestion.name}</li>
        ))}
      </ul>
    )}
    <ResultBox person={selectedPerson}/>
    

  </div>
);
};

export default Search;