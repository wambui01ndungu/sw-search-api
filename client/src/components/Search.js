import React, { useEffect, useState } from "react"
function Search(){
  const [results, setResults] = useState ([]);

const handleChange=(e)=>{
  const{key, value}=e.target;
  setResults((prev)=>({
    ...prev,
    [key]:value

  }));

};

const fechData=async()=>{
  const res= await fetch(URL)
  const data = await res.json()
console.log(data)
}


useEffect(()=>{
  fechData();
},[]);

return(
  <div>
    <h2> search</h2>
    <form >
      <input
      type="text"
      placeholder="search..."
      value={results.key}
      onChange={handleChange}
      /> 
    </form>

  </div>
);
};

export default Search;