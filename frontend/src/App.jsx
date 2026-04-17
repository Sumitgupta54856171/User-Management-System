import { useState, useEffect } from 'react'
import './index.css'
import './styles/mobile.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './components/login/Loginpage'
import Sidebar from './components/navbar/Navbar'
import MobileNavigation from './components/common/MobileNavigation'
import UserDashboard from './components/AdminDashboard/UserDashboard'
import ActivityLog from './components/ActivityLog/ActivityLog'
import Profile from './components/Profile'
import { useSelector, useDispatch } from 'react-redux'
import { loadUserFromStorage } from './store/authSlice'

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(loadUserFromStorage());
  }, [dispatch]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {isAuthenticated && <Sidebar userRole={user?.role} />}
      {isAuthenticated && <MobileNavigation userRole={user?.role} />}
      <div className="flex-1 md:ml-64">
        <Routes>
          <Route path="/" element={isAuthenticated ? <Navigate to="/users" /> : <LoginPage />} />
          <Route path="/users" element={isAuthenticated ? <UserDashboard /> : <Navigate to="/" />} />
          <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/" />} />
          <Route path="/activity" element={isAuthenticated ? <ActivityLog /> : <Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
