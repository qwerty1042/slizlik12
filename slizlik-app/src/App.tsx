import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Welcome from './pages/welcome';
import ClassicMode from './pages/ClassicMode';
import BDSMMode from './pages/BDSMMode';
import SlotMode from './pages/SlotMode';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome onReady={() => window.location.href = '/#/home'} />} />
        <Route path="/home" element={<Home />} />
        <Route path="/classic" element={<ClassicMode />} />
        <Route path="/bdsm" element={<BDSMMode />} />
        <Route path="/slot" element={<SlotMode />} />
      </Routes>
    </Router>
  );
};

export default App;
