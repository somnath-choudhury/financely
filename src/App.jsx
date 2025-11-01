import { useState } from 'react'
import './App.css'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import SignUp from './components/SignUp'
import Dashboard from './components/Dashboard'
import { ToastContainer } from 'react-toastify'
function App() {

  return (
    <div className=''>
      <Router>
        <ToastContainer />
        <Routes>
          <Route path='/' element={<SignUp/>}></Route>
          <Route path='/dashboard' element={<Dashboard/>}></Route>
        </Routes>
      </Router>
    </div>
  )
}

export default App
