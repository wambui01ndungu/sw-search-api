//results.js
import React from "react";

const ResultBox =({person})=>{
  if (!person) return null;


  return(
  <div>
    <table className="character-table">
   <tbody>
     <tr>
       <th>name</th>
       <td>{person.name}</td>
     </tr>
     <tr>
       <th>height</th>
       <td>{person.height}</td>
     </tr>
     <tr>
       <th>Mass</th>
       <td>{person.mass}</td>
     </tr>
     <tr>
       <th>hair color</th>
       <td>{person.hair_color}</td>
     </tr>
     <tr>
       <th>skin color</th>
       <td>{person.skin_color}</td>
     </tr>
     <tr>
       <th>eye color</th>
       <td>{person.eye_color}</td>
     </tr>
     
     <tr>
       <th>birth Year</th>
       <td>{person.birth_year}</td>
     </tr>
     <tr>
       <th>gender</th>
       <td>{person.gender}</td>
     </tr>

   </tbody>
 </table>

</div>);
}
export default ResultBox;