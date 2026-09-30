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
  let [user, setUser] = useState({});
  console.log('app user: ', user);
  
  return (
    <>
      <FlashMsg flashMsg={flashMsg} setFlashMsg={setFlashMsg}/>
      <Routes>
        <Route path='/' element={<SignIn flashMsg={setFlashMsg} setUser={setUser}/>}/>
        <Route path='/sign-up' element={<SignUp flashMsg={setFlashMsg} setUser={setUser}/>}/>
        <Route path='/home' element={<NewWay flashMsg={setFlashMsg} currentUser={user}/>}/>
        <Route path='*' element={<NotFound/>}/>
      </Routes>
    </>
  )
}

export default App;
