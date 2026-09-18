import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './SignUp.css';
import axios from 'axios';

export default function SignUp({flashMsg}){
  let[err, setErr]=useState(null);
  const navigate = useNavigate();  
  const handleSignup = async (e)=>{
      e.preventDefault();
      const data = {name, email, password};
      data.name = e.target[0].value;
      data.email = e.target[1].value;
      data.password = e.target[2].value;
      const msg = await axios.post('/api/create/user', data);
      console.log(msg);
      flashMsg();
      if(msg.status===200)
        navigate('/home');

        
    }

    return(
        <div className="signUpPage bg-black d-flex flex-column align-items-center justify-content-center">
            <form className='SignUpForm d-flex flex-column ps-5 pe-5 pt-3 pb-3 gap-4' onSubmit={handleSignup}>
              <div className="signUpInput d-flex flex-column gap-1">
                <h3 className='align-self-center m-0 mb-1'>Sign Up</h3>
                <div className="form-group w-100">
                  <label htmlFor="username">Enter your name</label>
                  <input type="text" className="form-control" id="username" aria-describedby="emailHelp" placeholder="Enter username" />
                </div>
                <div className="form-group w-100">
                  <label htmlFor="email">Email address</label>
                  <input type="email" className="form-control" id="email" aria-describedby="emailHelp" placeholder="Enter email" />
                </div>
                <div className="form-group w-100">
                  <label htmlFor="password">Password</label>
                  <input type="password" className="form-control" id="password" placeholder="Password" />
                </div>
              </div>
              
              <div className="signUpItem d-flex flex-column gap-1">
                <button type="submit" className="btn btn-primary">Sign Up</button>
                <Link to='/' className='align-self-center'>Existing user? Sign in</Link>
              </div>
            </form>
        </div>
    )
}