import './App.css'
import {Route, Routes} from 'react-router-dom';
import FlashMsg from './components/FlashMsg';

import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import NewWay from './pages/NewWay';
import { useState } from 'react';

function App() {
  let [flashMsg, setFlashMsg] = useState(null)
  
  return (
    <>
      {/* <NewWay/> */}
      <FlashMsg />
      <Routes>
        <Route path='/' element={<SignIn />}/>
        <Route path='/sign-up' element={<SignUp flashMsg={setFlashMsg}/>}/>
        <Route path='/home' element={<NewWay />}/>
      </Routes>
    </>
  )
}

export default App;
