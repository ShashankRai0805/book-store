import React, { useEffect } from 'react'
import Home from './pages/Home'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import {BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom'
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
import { ToastProvider } from './context/ToastContext'

// Layout component to handle conditional navbar rendering
const Layout = () => {
  const location = useLocation();
  const role = useSelector((state) => state.auth.role);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
  
  return (
    <>
      {!isAuthPage && <Navbar />}
      <Routes>
        <Route exact path='/' element={<Home/>}/>
        <Route exact path='/all-books' element={<AllBooks/>}/>
        <Route exact path='/cart' element={<Cart/>}/>
        <Route exact path='/admin' element={<AdminDashboard/>}/>
        <Route path='/profile' element={<Profile/>}>
          <Route index element={role === "user" ? <Favourites/> : <AllOrders/>}/>
          <Route path="favourites" element={<Favourites/>}/>
          <Route path="order-history" element={<OrderHistory/>}/>
          <Route path="settings" element={<Settings/>}/>
          <Route path="add-book" element={<AddBook/>}/>
          <Route path="all-orders" element={<AllOrders/>}/>
        </Route>
        <Route exact path='/login' element={<Login/>}/>
        <Route exact path='/signup' element={<SignUp/>}/>
        <Route exact path='/book-details/:id' element={<BookDetails/>}/>
      </Routes>
      {!isAuthPage && <Footer />}
    </>
  );
};

const App = () => {
  const dispatch = useDispatch();
  const role = useSelector((state) => state.auth.role);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  useEffect(() => {
    const id = localStorage.getItem("id");
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    
    if (id && token && role) {
      dispatch(login({ role, token, user: { id } }));
    }
  }, [dispatch]);

  return (
    <ToastProvider>
      <div>
        <Router>
          <Layout />
        </Router>
      </div>
    </ToastProvider>
  )
}

export default App
