import React  from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/login'
import Register from './pages/register'
import Profile from './pages/profile'
import Journal from './pages/journal'

import './App.css'

const App: React.FC = () => {

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Journal />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/profile' element={<Profile />} />
      </Routes>
    </Router>
  )
}

export default App

