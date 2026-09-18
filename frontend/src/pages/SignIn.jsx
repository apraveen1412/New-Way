import { Link } from 'react-router-dom';
import './SignIn.css';

export default function SignIn(){
    return(
        <div className="signInPage bg-black d-flex flex-column align-items-center justify-content-center">
          <form className='SignInForm d-flex flex-column ps-5 pe-5 pt-3 pb-3  justify-content-between gap-4' >
            <div className="signInInputs siginItem d-flex flex-column gap-1">
              <h3 className='m-0 mb-1 align-self-center'>Sign in</h3>
              
              <div className="form-group w-100">
                <label htmlFor="email">Email address</label>
                <input type="email" className="form-control" id="email" aria-describedby="emailHelp" placeholder="Enter email" />
              </div>
              <div className="form-group w-100">
                <label htmlFor="password">Password</label>
                <input type="password" className="form-control" id="password" placeholder="Password" />
              </div>
            </div>
            <div className="siginItem d-flex flex-column">
              <button type="submit" className="btn btn-primary mt-2">Sign in</button>
              <Link to='/sign-up' className='align-self-center mt-1'>New here? click to sign up</Link>
            </div>
          </form>
        </div>
    )
}