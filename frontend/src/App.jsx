import React, { useEffect } from 'react'
import Home from './pages/Home'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import {BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import AllBooks from './pages/AllBooks'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Cart from './pages/Cart'
import Profile from './pages/Profile'
import BookDetails from './pages/BookDetails'
import AdminDashboard from './pages/AdminDashboard'
import { useDispatch, useSelector } from 'react-redux'
import { login } from './store/auth'
import Favourites from './pages/Favourites'
import OrderHistory from './pages/OrderHistory'
import Settings from './pages/Settings'
import AllOrders from './pages/AllOrders'
import AddBook from './pages/AddBook'

const App = () => {
  const dispatch = useDispatch();
  const role = useSelector((state) => state.auth.role);

  useEffect(() => {
    const id = localStorage.getItem("id");
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    
    console.log("=== APP COMPONENT AUTH INITIALIZATION ===");
    console.log("id from localStorage:", id);
    console.log("token from localStorage:", token);
    console.log("role from localStorage:", role);
    
    if (id && token && role) {
      console.log("Dispatching login action with:", { role, token, user: { id } });
      dispatch(login({ role, token, user: { id } }));
      console.log("Login action dispatched");
    } else {
      console.log("Not dispatching login - missing credentials");
    }
    console.log("==========================================");
  }, [dispatch]);

  return (
    <div>
      <Router>
          <Navbar />
          <Routes>
            <Route exact path='/' element={<Home/>}/>
            <Route exact path='/all-books' element={<AllBooks/>}/>
            <Route exact path='/cart' element={<Cart/>}/>
            <Route exact path='/admin' element={<AdminDashboard/>}/>
            <Route path='/profile' element={<Profile/>}>
              <Route index element={role === "user" ? <Favourites/> : <AllOrders/>}/>
              <Route path="order-history" element={<OrderHistory/>}/>
              <Route path="settings" element={<Settings/>}/>
              <Route path="add-book" element={<AddBook/>}/>
            </Route>
            <Route exact path='/login' element={<Login/>}/>
            <Route exact path='/signup' element={<SignUp/>}/>
            <Route exact path='/book-details/:id' element={<BookDetails/>}/>
          </Routes>
          <Footer />
      </Router>
    </div>
  )
}

export default App
