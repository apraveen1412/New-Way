import { useState } from 'react';
import './ModelSelection.css'
export default function ModelSelection({aiModel}) {
  let [dropdownName, setDropdownName]=useState('Select model');

  let Local_Endpoint = '/api/conversation/onDevice';
  let Cloud_Endpoint = '/api/conversation';
  let models = ['Gemini nano (Local)', 'GPT-5.6 Luna', 'GPT-5.6 Sol'];
  function modelNamer(modelMame){
    return modelMame.replace(' ', '-').toLowerCase();
  }
  let Endpoint = (e)=>{
    setDropdownName(e.target.innerText);
    if(e.target.innerText === 'Gemini nano (Local)')  return aiModel(Local_Endpoint);
    for(let i=1; i<models.length; i++)
    if(e.target.innerText === models[i])  return aiModel(`${Cloud_Endpoint}/${modelNamer(models[i])}`);
  }
   
    return (
        <div className="dropdown">
          <button className="btn dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">{dropdownName}</button>
          <ul className="dropdown-menu">
            <li><a className="dropdown-item" onClick={Endpoint}>Gemini nano (Local)</a></li>
            <li><a className="dropdown-item" onClick={Endpoint}>GPT-5.6 Luna</a></li>
            <li><a className="dropdown-item" onClick={Endpoint}>GPT-5.6 Sol</a></li>
          </ul>
        </div>
    );
}

// ()=>aiModel(Local_Endpoint)
// gpt-5.6-sol