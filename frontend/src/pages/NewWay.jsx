import {useEffect, useState } from 'react';
import {onDeviceAI} from '../LocalAI.js';

import QueryBox from "../components/QueryBox.jsx";
import Response from '../components/ChatBody.jsx';
import Sidebar from "../components/Sidebar.jsx";

// import './NewWay.css';

export default function NewWay({flashMsg}){
    let [webResults, setWebResults]=useState(null);
    let [userQuery, setUserQuery]= useState('');
    let [newResponse, setNewResponse] = useState('');
    
    
    async function LocalWebRes(results){
      setWebResults(results);
    }

    async function getUserQuery(uq) {
      setUserQuery(uq);
    }
    
    return(
        <div className="new-way-app">
          <Sidebar flashMsg={flashMsg} />
          <main className='chat-container'>
              <Response AIres={newResponse} userQuery={userQuery}/>
              <QueryBox getWebRes={LocalWebRes} getUserQuery={getUserQuery} AIres={setNewResponse} flashMsg={flashMsg} />
          </main>
          <script src='./LocalAI.js'></script>
        </div>
        
    );
}