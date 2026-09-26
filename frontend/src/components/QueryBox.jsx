import axios from 'axios';
import { useEffect, useState } from 'react';
import './QueryBox.css';
import ModelSelection from './ModelSelection';
import { onDeviceAI } from '../LocalAI';
import { webRes } from './helper';

export default  function QueryBox({getWebRes, getUserQuery, AIres, flashMsg}){
    let [userQuery, setUserQuery] = useState('');
    let [selectModel, setSelectModel] = useState('');
    let [localWebResults, setLocalWebResults]=useState(null);
    let [conversationId, setConversationId] = useState('');
    

    const endpoints = {
        local: '/api/conversation/onDevice',
    };

    const handleSubmbit = async (event) => {
    event.preventDefault();

    console.log("selectModel:", selectModel);
    console.log("userQuery:", userQuery);
    let answer = "";

    // Chrome built-in / on-device model
    if (selectModel === endpoints.local && userQuery!=='') {
        try{
            const result = await axios.post(selectModel,{userQuery: userQuery});
            // flashMsg();
            setLocalWebResults(result);
            getUserQuery(userQuery);

            onDeviceAI(userQuery, result, AIres);

            return;
        }
        catch(err){
            console.log(err);
            flashMsg({
              success: false,
              message: err.response?.data?.message || 'You are not logged in, please sign in!'
            });
        }
    }
    else if(selectModel !== '' && userQuery!==''){
        try{
            // GPT 5.6 Luna streaming
            const result = await fetch(selectModel, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    userQuery: userQuery,
                    model: selectModel,
                    conversationId: conversationId
                })
            });
        
            if (!result.ok) {
                throw new Error(`Request failed: ${result.status}`);
            }
        
            if (!result.body) {
                throw new Error("Response body is empty");
            }
        
            const reader = result.body.getReader();
            const decoder = new TextDecoder();
        
            getUserQuery(userQuery);
        
            while (true) {
                const { value, done } = await reader.read();
            
                if (done) break;
            
                const chunk = decoder.decode(value, { stream: true });
            
                answer += chunk;
            
                AIres(answer);
            
                console.log("Received:", chunk);
            }
        
            // Process any remaining decoder data
            answer += decoder.decode();
            
            console.log("Final answer:", answer);
            setUserQuery("");
        }
        catch(err){
            console.log(err);
            flashMsg({
              success: false,
              message: err.response?.data?.message || 'You are not logged in, please sign in!'
            });
        }
    }
    AIres(answer);
};
    
    let qSubmit={
        borderRadius: '50%',
        width: '2rem',
        height: '2rem',
        display:'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: '0.5rem'
    }

    function aiModel(model){
        setSelectModel(model);
    }

    
    
    return(
        <form onSubmit={handleSubmbit} className='qForm' >
            <input 
                type="text" 
                name="userQuery" 
                placeholder="Ask something..." 
                id="userQuery" value={userQuery} 
                onChange={(e)=>setUserQuery(e.target.value)} 
                className="qBoxStyle form-control-plaintext"
                required
            />

            <ModelSelection aiModel={aiModel}/>
            <input type="hidden" name="model" value={`${selectModel}`} required/>
            <input type="hidden" name="conversationId" />
            <button type="submit" id="qSubmit" className='qSubmit btn btn-primary' style={qSubmit}>
                <i className="fa-solid fa-arrow-up" style={{color: "rgb(255, 255, 255)"}}></i>
            </button>
        </form>
    );
}