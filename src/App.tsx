import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import FileComplaint from './pages/FileComplaint';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import TrackComplaint from './pages/TrackComplaint';
import WhistleblowerVault from './pages/WhistleblowerVault';
import About from './pages/About';
import ContactUs from './pages/ContactUs';
import { Toaster } from 'react-hot-toast';
import { UserProvider } from './context/UserContext';
import { ComplaintProvider } from './context/ComplaintContext';
import { NotificationProvider } from './context/NotificationContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Chatbot from './components/chat/Chatbot';

function App() {
  return (
    <Router>
      <UserProvider>
        <ComplaintProvider>
          <NotificationProvider>
            <div className="flex flex-col min-h-screen bg-gray-50">
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/login" element={<Login />} />
                  <Route 
                    path="/file-complaint" 
                    element={
                      <ProtectedRoute>
                        <FileComplaint />
                      </ProtectedRoute>
                    } 
                  />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route 
                    path="/admin-dashboard" 
                    element={
                      <ProtectedRoute>
                        <AdminDashboard />
                      </ProtectedRoute>
                    } 
                  />
                  <Route path="/track-complaint" element={<TrackComplaint />} />
                  <Route 
                    path="/whistleblower" 
                    element={
                      <ProtectedRoute>
                        <WhistleblowerVault />
                      </ProtectedRoute>
                    } 
                  />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<ContactUs />} />
                </Routes>
              </main>
              <Footer />
              <Toaster position="top-right" />
              <Chatbot />
            </div>
          </NotificationProvider>
        </ComplaintProvider>
      </UserProvider>
    </Router>
  );
}

export default App;