import React, { useEffect, useState } from "react"
import { FaSearch } from 'react-icons/fa';
function Search(){
  //const [results, setResults] = useState ([]);
  const[query, setQuery]=useState("");
  const[ suggestions, setSuggestions]= useState([]);
  const[selectedPerson , setSelectedPerson]=useState(null)

const handleChange=(e)=>{
  setQuery(e.target.value);
};
  
const token = localStorage.getItem("token");

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
    {/*selected person data*/}
    {selectedPerson && (
  <table border="1" style={{ marginTop: "20px", borderCollapse: "collapse", width:"50%" }}>
    <tbody>
      <tr>
        <th>name</th>
        <td>{selectedPerson.name}</td>
      </tr>
      <tr>
        <th>height</th>
        <td>{selectedPerson.height}</td>
      </tr>
      <tr>
        <th>Mass</th>
        <td>{selectedPerson.mass}</td>
      </tr>
      <tr>
        <th>hair color</th>
        <td>{selectedPerson.hair_color}</td>
      </tr>
      <tr>
        <th>skin color</th>
        <td>{selectedPerson.skin_color}</td>
      </tr>
      <tr>
        <th>eye color</th>
        <td>{selectedPerson.eye_color}</td>
      </tr>
      
      <tr>
        <th>birth Year</th>
        <td>{selectedPerson.birth_year}</td>
      </tr>
      <tr>
        <th>gender</th>
        <td>{selectedPerson.gender}</td>
      </tr>

    </tbody>
  </table>
)}


  </div>
);
};

export default Search;