import axios from 'axios';
import { useEffect, useState } from 'react';
import './QueryBox.css';
import ModelSelection from './ModelSelection';

export default  function QueryBox({getWebRes, getUserQuery, AIres}){
    let [userQuery, setUserQuery] = useState('');
    let [selectModel, setSelectModel] = useState('');

    // let BACKEND_ENDPOINT = '/conversation';
    // let FRONTEND_ENDPOINT = '/conversation/onDevice';

    const handleSubmbit = async (event) => {
    event.preventDefault();

    console.log(selectModel);

    // Chrome built-in / on-device model
    if (selectModel === 'Gemini nano (Local)') {
        const result = await axios.post(selectModel,{userQuery: userQuery});

        getWebRes(result);
        getUserQuery(userQuery);

        return;
    }

    // Ollama streaming
    const result = await fetch(selectModel,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userQuery: userQuery
            })
        }
    );

    if (!result.ok) {
        throw new Error(`Request failed: ${result.status}`);
    }

    const reader = result.body.getReader();
    const decoder = new TextDecoder();

    let answer = "";

    getUserQuery(userQuery);

    while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, {stream: true});
        answer += chunk;
        console.log("Received:", chunk);
        AIres(answer);
    }
    console.log(answer);
    AIres(answer);
    setUserQuery('');
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
            />

            <ModelSelection aiModel={aiModel}/>
            <input type="hidden" name="model" value={selectModel} required/>
            <button type="submit" id="qSubmit" className='qSubmit btn btn-primary' style={qSubmit}>
                <i className="fa-solid fa-arrow-up" style={{color: "rgb(255, 255, 255)"}}></i>
            </button>
        </form>
    );
}
// action={BACKEND_ENDPOINT} method="post"