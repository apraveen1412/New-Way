import {useEffect, useState } from 'react';
import {onDeviceAI} from '../LocalAI.js';
import axios from 'axios';

import QueryBox from "../components/QueryBox.jsx";
import ChatBody from '../components/ChatBody.jsx';
import Sidebar from "../components/Sidebar.jsx";

// import './NewWay.css';

export default function NewWay({flashMsg, currentUser, setUser}){
    let [webResults, setWebResults]=useState(null);
    let [userQuery, setUserQuery]= useState('');
    let [conversationId, setConversationId] = useState('');
    let [newResponse, setNewResponse] = useState('');
    let [getMessages, setGetMessages] = useState([])
    
    useEffect(()=>{
      const userAuth = async ()=>{
        const user = await axios.get('/api/auth/me');
        setUser(user.data);
      }
      userAuth();
    },[]);
  
    async function LocalWebRes(results){
      setWebResults(results);
    }

    async function getUserQuery(uq) {
      setUserQuery(uq);
    }
    // console.log(currentUser.conversations);
    return(
        <div className="new-way-app">
          <Sidebar flashMsg={flashMsg} conversations = {currentUser?.conversations} setConversationId={setConversationId} setGetMessages={setGetMessages}/>
          <main className='chat-container'>
              <ChatBody AIres={newResponse} userQuery={userQuery} getMessages={getMessages}/>
              <QueryBox getWebRes={LocalWebRes} getUserQuery={getUserQuery} AIres={setNewResponse} flashMsg={flashMsg} conversationId={conversationId}/>
          </main>
          <script src='./LocalAI.js'></script>
        </div>
        
    );
}