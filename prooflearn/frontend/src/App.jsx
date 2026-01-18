import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Web3Provider } from './context/Web3Context';
import Landing from './pages/Landing';
import Marketplace from './pages/Marketplace';
import SubmitTask from './pages/SubmitTask';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';

const PageWrapper = ({ children }) => (
    <motion.main
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.4 }}
        className="pt-28 pb-12"
    >
        {children}
    </motion.main>
);

const AnimatedRoutes = () => {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<PageWrapper><Landing /></PageWrapper>} />
                <Route path="/marketplace" element={<PageWrapper><Marketplace /></PageWrapper>} />
                <Route path="/submit/:taskId" element={<PageWrapper><SubmitTask /></PageWrapper>} />
                <Route path="/admin" element={<PageWrapper><AdminDashboard /></PageWrapper>} />
                <Route path="/profile" element={<PageWrapper><Profile /></PageWrapper>} />
            </Routes>
        </AnimatePresence>
    );
};

const App = () => {
    return (
        <Web3Provider>
            <Router>
                <div className="min-h-screen bg-background text-slate-100 selection:bg-primary/30">
                    <div className="mesh-bg" />
                    <Navbar />
                    <AnimatedRoutes />
                </div>
            </Router>
        </Web3Provider>
    );
};

export default App;
