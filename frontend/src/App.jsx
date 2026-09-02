import {useEffect, useState } from 'react';
import QueryBox from './components/QueryBox.jsx';
import Response from './components/Response.jsx';
import './App.css'
import {onDeviceAI} from './webllm.js';

function App() {
  let [webResults, setWebResults]=useState(null);
  let [userQuery, setUserQuery]= useState('');
  let [newResponse, setNewResponse] = useState('');
  
  
  async function LocalWebRes(results){
    setWebResults(results);
  }

  async function getUserQuery(uq) {
    setUserQuery(uq);
  }

  // useEffect(()=>console.log('WebRes type: ',typeof(webResults),'\n','Web Results: ',webResults));
  useEffect(()=>{
    if(webResults===null && userQuery==='') return;
    onDeviceAI(userQuery, webResults, setNewResponse);  // gets the user query and web results from QueryBox.jsx and  pass it to AI model for inference
  },[userQuery, webResults]);

  return (
    <>
      <QueryBox getWebRes={LocalWebRes} getUserQuery={getUserQuery}/>
      <Response AIres={newResponse}/>
      <script src='./webllm.js'></script>
    </>
  )
}

export default App;
