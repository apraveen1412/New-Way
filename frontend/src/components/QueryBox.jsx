import axios from 'axios';
import { useEffect, useState } from 'react';
export default  function QueryBox({getWebRes, getUserQuery}){
    let [userQuery, setUserQuery]= useState('');

    let BACKEND_ENDPOINT = '/conversation';
    let FRONTEND_ENDPOINT = '/conversation/onDevice';

    const handleSubmbit = async (event)=>{
        event.preventDefault();
        let result = await axios.post(FRONTEND_ENDPOINT, {userQuery: userQuery});
        getWebRes(result);
        getUserQuery(userQuery);
    }
    let qForm = {
        backgroundColor: '#1e1f20',
        width: "90%",
        borderRadius: '0.5rem',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginRight: '1rem',
    }
    let qBoxStyle={
        backgroundColor: '#1e1f20',
        width: '100%',
        height: '4vh',
        padding: '0rem',
        paddingLeft: '1rem'
    };
    let qSubmit={
        backgroundColor: 'blue',
        border: 'none',
        width: '2rem',
        height: '2rem',
        borderRadius: '50%',
        margin: '0rem',
        marginRight: '0.5rem'
    }
    
    return(
        <form onSubmit={handleSubmbit} style={qForm} >
            <input 
                type="text" 
                name="userQuery" 
                placeholder="Ask something..." 
                id="userQuery" value={userQuery} 
                onChange={(e)=>setUserQuery(e.target.value)} 
                className="form-control-plaintext"
                style={qBoxStyle}
            />

            <button type="submit" id="qSubmit" style={qSubmit}><i className="fa-solid fa-arrow-up" style={{color: "rgb(255, 255, 255)"}}></i></button>
        </form>
    );
}
// action={BACKEND_ENDPOINT} method="post"