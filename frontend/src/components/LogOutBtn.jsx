import React from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const LogOutBtn = ({flashMsg}) => {
    const navigate = useNavigate();
  const logoutStyle ={
    width: '26vw',
    // backgroundColor:'transparent'
  }
  const handleLogout = async ()=>{
    try{
        let logoutResults = await axios.get('/api/logout');
        navigate('/');
        flashMsg?.(logoutResults.data);
    }
    catch(err){
        flashMsg?.({
            success: false,
            message: err.message || 'Logout Failed',
        });
    }
  }
  return (
    <div className='d-flex flex-column align-self-center'>
        <button type="button" className={`btn btn-danger mb-4`} style={logoutStyle} onClick={handleLogout}>Log out</button>
    </div>
  )
}

export default LogOutBtn