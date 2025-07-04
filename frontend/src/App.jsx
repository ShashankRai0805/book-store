import React from 'react'
import Home from './pages/Home'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import {BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import AllBooks from './pages/AllBooks'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Cart from './pages/Cart'
import Profile from './pages/Profile'

const App = () => {
  return (
    <div>
      <Router>
          <Navbar />
          <Routes>
            <Route exact path='/' element={<Home/>}/>
            <Route exact path='/all-books' element={<AllBooks/>}/>
            <Route exact path='/cart' element={<Cart/>}/>
            <Route exact path='/profile' element={<Profile/>}/>
            <Route exact path='/login' element={<Login/>}/>
            <Route exact path='/SignUp' element={<SignUp/>}/>
          </Routes>
          <Footer />
      </Router>
    </div>
  )
}

export default App
