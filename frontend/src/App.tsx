import React, { useState, useEffect } from 'react';
import { Container, } from 'react-bootstrap';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PageLayout from './components/layout/PageLayout';


export default function App() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', theme);
  }, [theme]);

  return (
    
       <BrowserRouter>
            <Routes>
              {/* Pass all matching wildcard paths down into the PageLayout manager */}
              <Route path="/*" element={<PageLayout theme={theme} setTheme={setTheme} />} />
            </Routes>
          </BrowserRouter>
    
    
  );
}
