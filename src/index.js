import React from 'react';
import { createRoot } from 'react-dom/client'; 
import App from './App';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserDetail from './components/UserDetail';

const container = document.getElementById('root');
const root = createRoot(container); 

root.render(
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/users/:id" element={<UserDetail />} />
    </Routes>
  </Router>
);
