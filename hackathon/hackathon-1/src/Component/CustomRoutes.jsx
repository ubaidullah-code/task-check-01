import React, { useContext } from 'react'
import { GlobalContext } from '../Context/Context'
import { Navigate, Route, Routes } from 'react-router'
import { CircularProgress } from '@mui/material'
import EventManagerDashboard from '../Dashboard/EventManagerDashboard'
import AdminDashboard from '../Dashboard/AdminDashboard'
import LoginPage from '../pages/loginPage'
import SignPage from '../pages/signPage';
import Home from '../pages/Home'
import UserDashboard from '../Dashboard/UserDashboard'
import Header from './Header'
import Footer from './Footer'


const CustomRoutes = () => {
    const{state}=useContext(GlobalContext)
  return (
    <div>
        {(state.isLogin && state.isAdmin)?
        <>
        <Header/>
        <Routes>
             <Route path='/event' element={<AdminDashboard />} />
            <Route path='*' element={<Navigate to="/event" />} />
        </Routes>
        <Footer/>
        </>
        :
        (state.isLogin && !state.isAdmin && !state.isManager )?
        <>
            <Header/>
        <Routes>
              <Route path='/dashboard' element={<UserDashboard />} />
                <Route path='*' element={<Navigate to="/dashboard" />} />
        </Routes>
                <Footer/>
        </>
        
        :
        (state.isLogin && state.isManager)?
        <>
        <Header/>
        <Routes>
             <Route path='/events' element={<EventManagerDashboard />} />
            <Route path='*' element={<Navigate to="/events" />} />    
        </Routes>
        <Footer/>
        </>
        :
        (state.isLogin == false)?
        <>
        <Header/>
        <Routes>
             <Route path='/' element={<Home />} />
                  <Route path='/signPage' element={<SignPage />} />
                  <Route path='/loginPage' element={<LoginPage />} />
                  <Route path='*' element={<Navigate to="/loginPage" />} />
        </Routes>
        
        </>
        :
        <div style={{ 
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    overflow: 'hidden' // Prevents scrollbars
                }}>
                    <CircularProgress size={100} /> 
                    </div>
        }
    </div>
  )
}

export default CustomRoutes