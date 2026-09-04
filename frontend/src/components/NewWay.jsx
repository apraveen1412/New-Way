import {useEffect, useState } from 'react';
import {onDeviceAI} from '../LocalAI.js';

import QueryBox from "./QueryBox";
import Response from './Response';
import Sidebar from "./sidebar";

export default function NewWay(){
    let [webResults, setWebResults]=useState(null);
    let [userQuery, setUserQuery]= useState('');
    let [newResponse, setNewResponse] = useState('');
    
    
    async function LocalWebRes(results){
      setWebResults(results);
    }

    async function getUserQuery(uq) {
      setUserQuery(uq);
    }

    useEffect(()=>{
      if(webResults===null && userQuery==='') return;
      onDeviceAI(userQuery, webResults, setNewResponse);  // gets the user query and web results from QueryBox.jsx and  pass it to AI model for inference
    },[userQuery, webResults]);

    let newWayBody = {
      display: 'flex', 
      flexDirection: 'column',
      width:'100%',
    }
    
    return(
        <div style={{display: 'flex', width: '100vw', height: '100vh'}} className='d-flex'>
            <Sidebar />
            <div style={newWayBody}>
                <Response AIres={newResponse}/>
                <QueryBox getWebRes={LocalWebRes} getUserQuery={getUserQuery}/>
            </div>
            <script src='./LocalAI.js'></script>
        </div>
    );
}