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
    const [refreshUser, setRefreshUser] = useState(false);
    let [selectModel, setSelectModel] = useState('');
    let [localWebResults, setLocalWebResults]=useState(null);

    
    useEffect(()=>{
      const root = document.documentElement;
      const vv = window.visualViewport;
      root.classList.add('chat-lock');

      const syncViewport = ()=>{
        root.style.setProperty('--app-height', `${vv ? vv.height : window.innerHeight}px`);
        root.style.setProperty('--app-top', `${vv ? vv.offsetTop : 0}px`);
        if (window.scrollY !== 0) window.scrollTo(0, 0);
      };

      syncViewport();
      vv?.addEventListener('resize', syncViewport);
      vv?.addEventListener('scroll', syncViewport);
      window.addEventListener('orientationchange', syncViewport);

      return ()=>{
        vv?.removeEventListener('resize', syncViewport);
        vv?.removeEventListener('scroll', syncViewport);
        window.removeEventListener('orientationchange', syncViewport);
        root.classList.remove('chat-lock');
        root.style.removeProperty('--app-height');
        root.style.removeProperty('--app-top');
      };
    },[]);

    useEffect(()=>{
      const userAuth = async ()=>{
        const user = await axios.get('/api/auth/me');
        setUser(user.data);
      }
      userAuth();
    },[refreshUser]);
  
    async function LocalWebRes(results){
      setWebResults(results);
    }

    async function getUserQuery(uq) {
      setUserQuery(uq);
    }

    const handleNewChat = () => {
      setConversationId('');
      setGetMessages([]);
      setUserQuery('');
      setNewResponse('');
    };

    const archiveExchange = (query, answer, model) => {
      setGetMessages(prev => [
        ...prev,
        { _id: crypto.randomUUID(), userquery: query, response: answer, model }
      ]);
      setUserQuery('');     // clear the live bubble
      setNewResponse('');   // clear the live stream
    };

    const submitProps = {
      conversationId,
      setConversationId,
      getUserQuery: setUserQuery,
      setNewResponse,
      onExchangeDone: archiveExchange,
      setRefreshUser,
      flashMsg,
    };

    return(
        <div className="new-way-app">
          <Sidebar flashMsg={flashMsg} conversations={currentUser?.conversations} setConversationId={setConversationId} setGetMessages={setGetMessages} onNewChat={handleNewChat}/>
          <main className='chat-container'>
              <ChatBody AIres={newResponse} userQuery={userQuery} getMessages={getMessages} submitProps ={submitProps}/>
              <QueryBox getWebRes={LocalWebRes} getUserQuery={getUserQuery} AIres={setNewResponse} flashMsg={flashMsg} conversationId={conversationId} setRefreshUser={setRefreshUser} setConversationId={setConversationId} onExchangeDone={archiveExchange} userQuery={userQuery} setUserQuery={setUserQuery} localWebResults={localWebResults} setLocalWebResults={setLocalWebResults} selectModel={selectModel} setSelectModel={setSelectModel}/>
              
          </main>
          <script src='./LocalAI.js'></script>
        </div>
        
    );
}