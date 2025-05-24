import React, { useEffect, useState } from "react"
import { FaSearch } from 'react-icons/fa';
import ResultBox from "./Result";
function Search(){
  //const [results, setResults] = useState ([]);
  const[query, setQuery]=useState("");
  const[ suggestions, setSuggestions]= useState([]);
  const[selectedPerson , setSelectedPerson]=useState(null)

const handleChange=(e)=>{
  const newQuery=e.target.value;
  setQuery(newQuery);
  setSelectedPerson(null);

  if (newQuery.trim()!==""){
    fetch(`http://localhost:3006/api/search?query=${newQuery}`)
    .then((res) => res.json())
    .then((data) => {
      setSuggestions(data.results); 
    });
    
  } else{
    setSuggestions([]);
  }
};
  
const token = localStorage.getItem("token");

fetch("http://localhost:3006/search", {
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

// send data to the backend
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
  setSelectedPerson(suggestion);
  
};

const handleSearchClick=()=>{
  fetch(`https://swapi.py4e.com/api/people/?search=${query}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.results && data.results.length > 0) {
          setSelectedPerson(data.results[0]); // show the first matching person
        } else {
          setSelectedPerson(null);
          alert("No match found");
        }
      })
      .catch((err) => console.error("Error on search click", err));
  
 
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
    <ResultBox person={selectedPerson}/>
    

  </div>
);
};

export default Search;