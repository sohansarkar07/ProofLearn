import React from 'react';
import { Link } from 'react-router-dom';
import { useWeb3 } from '../context/Web3Context';
import { Wallet, Menu, X, ChevronRight } from 'lucide-react';
import Logo from './Logo';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const { account, connectWallet } = useWeb3();
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <nav className="fixed top-0 left-0 right-0 z-[100] px-6 py-4">
            <div className="max-w-7xl mx-auto glass-panel px-6 py-3 flex justify-between items-center border-white/5 bg-surface/20">
                <Link to="/" className="hover:opacity-80 transition-opacity">
                    <Logo />
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    <Link to="/marketplace" className="nav-link font-medium">Marketplace</Link>
                    <Link to="/profile" className="nav-link font-medium">Profile</Link>
                    <Link to="/admin" className="nav-link font-medium">Admin</Link>

                    {account ? (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-3 bg-primary/10 border border-primary/30 px-4 py-2 rounded-xl text-primary font-mono text-sm shadow-[0_0_15px_rgba(34,211,238,0.2)]"
                        >
                            <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(34,211,238,1)]" />
                            {account.slice(0, 6)}...{account.slice(-4)}
                        </motion.div>
                    ) : (
                        <button onClick={connectWallet} className="btn-neon-primary py-2 px-6 text-sm flex items-center gap-2 group">
                            <Wallet size={16} className="group-hover:rotate-12 transition-transform" />
                            Connect Wallet
                        </button>
                    )}
                </div>

                {/* Mobile Toggle */}
                <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="md:hidden absolute top-24 left-6 right-6 glass-panel p-6 bg-surface/90 border-primary/20"
                    >
                        <div className="flex flex-col gap-6">
                            <Link to="/marketplace" onClick={() => setIsOpen(false)} className="nav-link text-lg">Marketplace</Link>
                            <Link to="/profile" onClick={() => setIsOpen(false)} className="nav-link text-lg">Profile</Link>
                            <Link to="/admin" onClick={() => setIsOpen(false)} className="nav-link text-lg">Admin</Link>
                            {!account && (
                                <button onClick={() => { connectWallet(); setIsOpen(false); }} className="btn-neon-primary w-full py-4">
                                    Connect Wallet
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
