import './ModelSelection.css'
export default function ModelSelection({aiModel}) {
    let Local_Endpoint = '/conversation/onDevice';
    let Cloud_Endpoint = '/conversation';

    let Endpoint = (e)=>{
      if(e.target.innerText === 'Local')  aiModel(Local_Endpoint);
      if(e.target.innerText === 'Cloud')  aiModel(Cloud_Endpoint);
    }
   
    return (
        <div className="dropdown">
          <button className="btn dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">Select Model</button>
          <ul className="dropdown-menu">
            <li><a className="dropdown-item" onClick={Endpoint}>Local</a></li>
            <li><a className="dropdown-item" onClick={()=>aiModel(Cloud_Endpoint)}>Cloud</a></li>
          </ul>
        </div>
    );
}

// ()=>aiModel(Local_Endpoint)
