import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useWeb3 } from '../context/Web3Context';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, ExternalLink, Shield, Wallet, Clock, CheckCircle, Smartphone, Zap, ChevronRight } from 'lucide-react';
import SkillGraph from '../components/SkillGraph';
import API_BASE_URL from '../config';

const Profile = () => {
    const { account } = useWeb3();
    const [mySubmissions, setMySubmissions] = useState([]);
    const [userStats, setUserStats] = useState({ xp: 0, level: 1, skills: {} });

    useEffect(() => {
        if (account) {
            const fetchMyData = async () => {
                try {
                    const [subRes, userRes] = await Promise.all([
                        axios.get(`${API_BASE_URL}/api/submissions`),
                        axios.get(`${API_BASE_URL}/api/users/${account}`)
                    ]);
                    setMySubmissions(subRes.data.filter(s => s.learnerAddress?.toLowerCase() === account.toLowerCase()));

                    // Mock user stats if endpoint not ready
                    setUserStats({
                        xp: userRes.data?.xp || 2450,
                        level: userRes.data?.level || 5,
                        skills: userRes.data?.skills || { "Solidity": 80, "React": 65, "DeFi": 40, "Security": 20, "Design": 90 }
                    });
                } catch (err) {
                    console.error("Error fetching profile", err);
                    // Fallback Mock
                    setUserStats({
                        xp: 2450,
                        level: 5,
                        skills: { "Solidity": 80, "React": 65, "DeFi": 40, "Security": 20, "Design": 90 }
                    });
                }
            };
            fetchMyData();
        }
    }, [account]);

    if (!account) {
        return (
            <div className="container mx-auto px-6 py-24 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-panel p-16 max-w-xl mx-auto border-dashed border-white/10"
                >
                    <Smartphone size={64} className="mx-auto text-primary mb-8 opacity-20" />
                    <h1 className="text-4xl font-black mb-4 uppercase tracking-tighter">Terminal Disconnected</h1>
                    <p className="text-slate-400 mb-0">Please initialize your Web3 identity to access the portfolio vault.</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-6 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">

                {/* User Identity Column */}
                <div className="lg:col-span-1 space-y-8 sticky top-28">
                    <div className="neon-card bg-mesh-gradient p-1 group">
                        <div className="bg-surface/90 p-8 rounded-[inherit] relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 font-mono text-[8px] text-slate-700 pointer-events-none opacity-50 uppercase tracking-widest">Digital Auth Identity v4.0</div>
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent p-[2px] mb-8 group-hover:rotate-6 transition-transform">
                                <div className="w-full h-full rounded-[inherit] bg-surface flex items-center justify-center text-3xl font-black">
                                    {account.slice(2, 4).toUpperCase()}
                                </div>
                            </div>
                            <h1 className="text-3xl font-black uppercase tracking-tight mb-2">My Identity</h1>
                            <div className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded-xl border border-white/5 border-primary/20 mb-8 self-start w-fit">
                                <Wallet size={14} className="text-primary" />
                                <span className="font-mono text-xs text-slate-300">{account.slice(0, 14)}...{account.slice(-8)}</span>
                            </div>

                            <div className="space-y-4 pt-6 border-t border-white/5">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Level</span>
                                    <span className="text-accent font-black text-xl">Lvl {userStats.level}</span>
                                </div>
                                <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                                    <div className="bg-gradient-to-r from-primary to-accent h-full" style={{ width: `${(userStats.xp % 1000) / 10}%` }} />
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Total XP</span>
                                    <span className="text-primary font-black">{userStats.xp} XP</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Missions</span>
                                    <span className="text-white font-black">{mySubmissions.length}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Skill Graph Widget */}
                    <div className="glass-panel p-6">
                        <h3 className="text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Zap size={14} className="text-yellow-400" /> Skill Matrix
                        </h3>
                        <SkillGraph data={userStats.skills} />
                    </div>
                </div>

                {/* Content Column */}
                <div className="lg:col-span-2 space-y-16">
                    {/* Certificates Section */}
                    <section>
                        <header className="flex justify-between items-end mb-8 border-b border-white/5 pb-6">
                            <div>
                                <h2 className="text-2xl font-black uppercase tracking-widest flex items-center gap-3">
                                    <Award className="text-primary animate-pulse" /> Verified Credentials
                                </h2>
                                <p className="text-slate-500 text-sm mt-1">Immutable on-chain SVG certificates</p>
                            </div>
                        </header>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {mySubmissions.filter(s => s.status === 'approved').length > 0 ? (
                                mySubmissions.filter(s => s.status === 'approved').map((sub, i) => (
                                    <motion.div
                                        key={sub._id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="neon-card bg-surface/40 p-1 group hover:border-green-500/30"
                                    >
                                        <div className="bg-gradient-to-br from-green-500/5 to-primary/5 p-8 rounded-[inherit] relative overflow-hidden h-full flex flex-col">
                                            <div className="absolute top-0 right-0 p-4">
                                                <div className="bg-green-500/10 text-green-400 border border-green-500/30 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Verified</div>
                                            </div>
                                            <Shield className="text-green-500/20 mb-6" size={48} />
                                            <h3 className="text-2xl font-black mb-1 group-hover:text-green-400 transition-colors uppercase">Task #{sub.taskId}</h3>
                                            <p className="text-slate-500 text-[10px] font-mono mb-8">VERIFICATION HASH: {sub.proofHash.slice(0, 16)}...</p>

                                            <div className="mt-auto pt-6 border-t border-white/5 flex gap-4">
                                                <a
                                                    href={`https://sepolia.etherscan.io/token/YOUR_CONTRACT_ADDRESS?a=${sub.mintedTokenId}`}
                                                    target="_blank" rel="noreferrer"
                                                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/5 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-colors"
                                                >
                                                    Explorer <ExternalLink size={12} />
                                                </a>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="col-span-full py-16 text-center glass-panel border-dashed border-white/5">
                                    <Shield size={48} className="mx-auto text-slate-700 mb-4 opacity-50" />
                                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No on-chain credentials found</p>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Timeline/History Section */}
                    <section>
                        <h2 className="text-2xl font-black uppercase tracking-widest mb-8 flex items-center gap-3">
                            <Clock className="text-slate-500" /> Interaction History
                        </h2>
                        <div className="space-y-4">
                            {mySubmissions.map((sub, i) => (
                                <motion.div
                                    key={sub._id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="glass-panel p-6 flex justify-between items-center group hover:bg-white/[0.02]"
                                >
                                    <div className="flex items-center gap-6">
                                        <div className={`w-3 h-3 rounded-full ${sub.status === 'pending' ? 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]' :
                                            sub.status === 'approved' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' :
                                                'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'
                                            }`} />
                                        <div>
                                            <p className="font-bold text-sm">Mission #{sub.taskId}</p>
                                            <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">{new Date(sub.submittedAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <span className={`px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest ${sub.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' :
                                            sub.status === 'approved' ? 'bg-green-500/10 text-green-500' :
                                                'bg-red-500/10 text-red-500'
                                            }`}>
                                            {sub.status}
                                        </span>
                                        <ChevronRight size={16} className="text-slate-700 group-hover:text-white transition-colors" />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Profile;
