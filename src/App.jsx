import React from 'react';
import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Pages/Login';
import MainPage from './Pages/MainPage';
function App() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/mainpage" element={<MainPage />} />
      </Routes>
    </Router>
  )
}

export default App
