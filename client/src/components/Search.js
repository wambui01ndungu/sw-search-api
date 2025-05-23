import React, { useEffect, useState } from "react"
import { FaSearch } from 'react-icons/fa';
function Search(){
  //const [results, setResults] = useState ([]);
  const[query, setQuery]=useState("");
  const[ suggestions, setSuggestions]= useState([]);

const handleChange=(e)=>{
  setQuery(e.target.value);
};
  
/*const token = localStorage.getItem("token");

fetch("http://localhost:3005/search", {
  method: "GET",
  headers: {
    "Authorization": `Bearer ${token}`
  }
})
.then(res => res.json())
.then(data => {
  console.log(data);
})
.catch(err => {
  console.error("Unauthorized or error:", err);
})
*/// send data to the backend
useEffect(()=>{
  if(!query){
    setSuggestions([]);
    return;
  }
  const delayBounce=setTimeout(()=>{
  if(query.length > 1){
    fetch (`https://swapi.py4e.com/api/people/?search=${query}`)
    
    .then((res)=>res.json())
    .then((data)=>{
      setSuggestions(data.results || []);
    })
    .catch((err)=> console.error("error fetching suggestions", err));
  }

  else {
  setSuggestions([]);
  }
  },300);
  return () => clearTimeout (delayBounce);
},[query]);

const handleSuggestionClick=(suggestion)=>{
  setQuery(suggestion.name);
  setSuggestions([]);
  
}
const handleSearchClick=()=>{
  delayBounces();
 
};
  
 

return(
  <div className= "search-container">
     
      <input
      type="text"
      placeholder="search..."
      value={query}
      onChange={handleChange}
      /> 
      <FaSearch
      className="search-icon"
      onClick={handleSearchClick}
  />
    
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

  </div>
);
};

export default Search;