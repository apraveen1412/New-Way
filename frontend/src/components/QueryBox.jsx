import axios from 'axios';
import { useEffect, useState } from 'react';
import './QueryBox.css';

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

            <button type="submit" id="qSubmit" className='qSubmit btn btn-primary'>
                <i className="fa-solid fa-arrow-up" style={{color: "rgb(255, 255, 255)"}}></i>
            </button>
        </form>
    );
}
// action={BACKEND_ENDPOINT} method="post"