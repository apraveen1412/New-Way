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
    // useEffect(()=>console.log('WEB RESULTS: ',webResults), [webResults]);
    // useEffect(()=>{})

    
    return(
        <form onSubmit={handleSubmbit}>
            <input type="text" name="userQuery" placeholder="Ask something..." id="userQuery" value={userQuery} onChange={(e)=>setUserQuery(e.target.value)}/>
            <button type="submit" id="qSubmit">Get</button>
        </form>
    );
}
// action={BACKEND_ENDPOINT} method="post"