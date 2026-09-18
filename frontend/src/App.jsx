import NewWay from './pages/NewWay';
import './App.css'
import {Route, Routes} from 'react-router-dom';

import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'

function App() {
  
  return (
    <>
      {/* <NewWay/> */}
      <Routes>
        <Route path='/' element={<SignIn />}/>
        <Route path='/sign-up' element={<SignUp />}/>
        <Route path='/home' element={<NewWay />}/>
      </Routes>
    </>
  )
}

export default App;
