import axios from 'axios';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './QueryBox.css';
import ModelSelection from './ModelSelection';
import { onDeviceAI } from '../LocalAI';
import { webRes } from './helper';

export default  function QueryBox({getWebRes, getUserQuery, AIres, flashMsg, conversationId, setRefreshUser, setConversationId, onExchangeDone }){
    let [userQuery, setUserQuery] = useState('');
    let [selectModel, setSelectModel] = useState('');
    let [localWebResults, setLocalWebResults]=useState(null);
    const textareaRef = useRef(null);

    // Auto-grow the textarea with its content (ChatGPT/Claude/Gemini style).
    // Resets to 'auto' first so it can also shrink when text is deleted or the box is cleared.
    useLayoutEffect(() => {
        const el = textareaRef.current;
        if (!el) return;
        el.style.height = 'auto';
        const maxHeight = parseFloat(getComputedStyle(el).maxHeight);
        const next = el.scrollHeight;
        if (Number.isFinite(maxHeight) && next > maxHeight) {
            el.style.height = `${maxHeight}px`;
            el.style.overflowY = 'auto';      // scroll only once the max height is reached
        } else {
            el.style.height = `${next}px`;
            el.style.overflowY = 'hidden';
        }
    }, [userQuery]);

    async function saveBD(conversationId, userQuery, fullResponse, modelName) {
        const result = await axios.post('/api/db/onDevice', {
            conversationId: conversationId,
            userPrompt: userQuery,
            fullResponse: fullResponse,
            modelName: modelName
        });
        // console.log('DB Result:', result.data);
        // Store the conversation ID
        if (result.data.conversationId) {
            setConversationId(result.data.conversationId);
            // console.log('Conversation ID:', result.data.conversationId);
        }
    }

    const endpoints = {
        local: '/api/conversation/onDevice',
        cloud: '/api/conversation/'
    };

    const navigate = useNavigate();

    const handleSubmbit = async (event) => {
        event.preventDefault();
        if (!userQuery.trim()) return;
        const sentQuery = userQuery;   
        getUserQuery(sentQuery);
        let answer = "";

        // Chrome built-in / on-device model
        if (selectModel === endpoints.local && userQuery!=='') {
            try{
                const result = await axios.post(endpoints.local,{
                    userQuery: userQuery,
                    model: selectModel,
                    conversationId: conversationId
                });
                setLocalWebResults(result.data.webResults);
                setConversationId(result.data.conversationId);

                let response = await onDeviceAI(userQuery, result, AIres);
                if (response) { // onDeviceAI returns undefined on failure
                    await saveBD(conversationId, sentQuery, response, selectModel);
                    onExchangeDone(sentQuery, response, selectModel);
                    setUserQuery('');   // input is never cleared in this path today
                }
                setRefreshUser(prev => !prev);
                return;
            }
            catch(err){
                // console.log(err);
                navigate('/home');
                flashMsg({
                  success: false,
                  message: err.response?.data?.message || 'Something went wrong'
                });
            }
        }
        else if(selectModel !== '' && userQuery!==''){
            try{
                // GPT 5.6 Luna streaming
                const result = await fetch(endpoints.cloud, {
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
            
                while (true) {
                    const { value, done } = await reader.read();
                    if (done) break;
                    const chunk = decoder.decode(value, { stream: true });
                    
                    answer += chunk;
                    AIres(answer);
                }

                answer += decoder.decode();

                // Get conversation ID
                const marker = '__CONVERSATION_ID__:';
                const markerIndex = answer.indexOf(marker);

                if (markerIndex !== -1) {
                    const newConversationId = answer.substring(markerIndex + marker.length).trim();
                
                    console.log('New conversation ID:', newConversationId);
                
                    setConversationId(newConversationId);
                
                    answer = answer.substring(0, markerIndex).trim();
                
                    AIres(answer);
                }
                onExchangeDone(sentQuery, answer, selectModel);
                setUserQuery("");
            }
            catch(err){
                // console.log(err);
                navigate('/home');
                flashMsg({
                  success: false,
                  message: err.response?.data?.message || 'Something went wrong'
                });
            }
        }
        setRefreshUser(prev => !prev);
    };
    
    let qSubmit={
        borderRadius: '50%',
        width: '2rem',
        height: '2rem',
        display:'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: '0.6rem'
    }

    function aiModel(model){
        setSelectModel(model);
    }

    
    
    return(
        <form onSubmit={handleSubmbit} className='qForm' >
            <textarea 
                ref={textareaRef}
                rows={1}
                name="userQuery" 
                placeholder="Ask something..." 
                id="userQuery" value={userQuery} 
                onChange={(e)=>setUserQuery(e.target.value)} 
                className="qBoxStyle form-control-plaintext pe-2"
                required
            />

            <ModelSelection aiModel={aiModel}/>
            <input type="hidden" name="conversationId" />
            <button type="submit" id="qSubmit" className='qSubmit btn btn-primary' style={qSubmit}>
                <i className="fa-solid fa-arrow-up" style={{color: "rgb(255, 255, 255)"}}></i>
            </button>
        </form>
    );
}