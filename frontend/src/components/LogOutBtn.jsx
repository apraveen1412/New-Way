import React from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const LogOutBtn = ({flashMsg}) => {
    const navigate = useNavigate();
  const logoutStyle ={
    width: '100%',
    backgroundColor:'transparent'
  }
  const handleLogout = async ()=>{
    try{
        let logoutResults = await axios.get('/api/logout');
        navigate('/');
        flashMsg(logoutResults.data);
    }
    catch(err){
        flashMsg({
            success: false,
            message: err.message || 'Logout Failed',
        });
    }
  }
  return (
    <div>
        <hr />
        <button type="button" className={`btn btn-secondary`} style={logoutStyle} onClick={handleLogout}>Log out</button>
    </div>
  )
}

export default LogOutBtn