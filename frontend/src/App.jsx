import './App.css'
import {Route, Routes} from 'react-router-dom';
import FlashMsg from './components/FlashMsg';

import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import NewWay from './pages/NewWay';
import { useState } from 'react';
import NotFound from './pages/NotFound';

function App() {
  const [flashMsg, setFlashMsg] = useState({
    success: false,
    message: ''
  });
  
  return (
    <>
      <FlashMsg flashMsg={flashMsg} setFlashMsg={setFlashMsg}/>
      <Routes>
        <Route path='/' element={<SignIn flashMsg={setFlashMsg}/>}/>
        <Route path='/sign-up' element={<SignUp flashMsg={setFlashMsg}/>}/>
        <Route path='/home' element={<NewWay flashMsg={setFlashMsg}/>}/>
        <Route path='*' element={<NotFound/>}/>
      </Routes>
    </>
  )
}

export default App;
