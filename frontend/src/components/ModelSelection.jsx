import './ModelSelection.css'
export default function ModelSelection({aiModel}) {

   
    return (
        <div className="dropdown">
          <button className="btn dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">Select Model</button>
          <ul className="dropdown-menu">
            <li><a className="dropdown-item" onClick={aiModel('/conversation/onDevice')}>Local</a></li>
            <li><a className="dropdown-item" onClick={aiModel('/conversation')}>Cloud</a></li>
          </ul>
        </div>
    );
}


