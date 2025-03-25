import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage.tsx';
import Layout from './components/layout/Layout';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage/>} />
          <Route path="auth" element={<AuthPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
