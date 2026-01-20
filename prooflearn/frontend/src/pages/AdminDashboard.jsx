import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useWeb3 } from '../context/Web3Context';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Users, CheckCircle, XCircle, ExternalLink, ShieldCheck, Activity, Database } from 'lucide-react';
import API_BASE_URL from '../config';

const AdminDashboard = () => {
    const [submissions, setSubmissions] = useState([]);
    const { account } = useWeb3();
    const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0 });

    useEffect(() => {
        const fetchSubmissions = async () => {
            const res = await axios.get(`${API_BASE_URL}/api/submissions`);
            setSubmissions(res.data);
            setStats({
                total: res.data.length,
                pending: res.data.filter(s => s.status === 'pending').length,
                approved: res.data.filter(s => s.status === 'approved').length
            });
        };
        fetchSubmissions();
    }, []);

    const handleVerify = async (id, status, learner, taskId) => {
        try {
            await axios.patch(`${API_BASE_URL}/api/submissions/verify`, {
                submissionId: id,
                status,
                skillName: "Web3 Developer",
                level: "Advanced"
            });
            alert(`Submission ${status}! NFT Minting triggered.`);
            window.location.reload();
        } catch (error) {
            console.error(error);
            alert("Verification failed");
        }
    };

    return (
        <div className="container mx-auto px-6 py-12">
            <div className="flex flex-col lg:flex-row gap-12">
                {/* Sidebar (Desktop) */}
                <div className="hidden lg:block w-64 space-y-4">
                    <div className="p-6 glass-panel bg-primary/5 border-primary/20 mb-8">
                        <div className="flex items-center gap-3 text-primary mb-2">
                            <ShieldCheck size={20} />
                            <span className="font-bold uppercase tracking-widest text-xs">Admin Access</span>
                        </div>
                        <p className="text-[10px] font-mono text-slate-500 break-all">{account}</p>
                    </div>

                    <nav className="space-y-1">
                        <button className="w-full flex items-center gap-3 px-4 py-3 bg-primary/10 text-primary rounded-xl font-bold border border-primary/20">
                            <LayoutDashboard size={18} /> Submissions
                        </button>
                        <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-white/5 rounded-xl transition-colors">
                            <Users size={18} /> Curators
                        </button>
                        <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-white/5 rounded-xl transition-colors">
                            <Activity size={18} /> Network Status
                        </button>
                    </nav>
                </div>

                {/* Main Content */}
                <div className="flex-1 space-y-10">
                    <header className="flex justify-between items-center">
                        <h1 className="text-4xl font-black gradient-text uppercase tracking-tight">Curator Panel</h1>
                        <div className="flex items-center gap-2 text-xs font-mono text-slate-500 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                            <Database size={12} /> API v1.0.4-stable
                        </div>
                    </header>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { label: "Total Submissions", value: stats.total, icon: <Database size={24} />, color: "text-blue-400" },
                            { label: "Pending Review", value: stats.pending, icon: <Activity size={24} />, color: "text-yellow-400" },
                            { label: "On-Chain Verified", value: stats.approved, icon: <ShieldCheck size={24} />, color: "text-green-400" }
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="glass-panel p-6 border-white/5 relative overflow-hidden group"
                            >
                                <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform ${stat.color}`}>
                                    {stat.icon}
                                </div>
                                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">{stat.label}</p>
                                <p className={`text-4xl font-black ${stat.color}`}>{stat.value}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Submissions Table */}
                    <div className="glass-panel overflow-hidden border-white/5">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-white/5">
                                    <tr>
                                        <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-slate-500">Learner Identity</th>
                                        <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-slate-500">Mission</th>
                                        <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-slate-500">Status</th>
                                        <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-slate-500 text-right">Verification</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <AnimatePresence>
                                        {submissions.map((sub, i) => (
                                            <motion.tr
                                                key={sub._id}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: i * 0.05 }}
                                                className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                                            >
                                                <td className="py-5 px-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-[10px] font-bold text-primary border border-primary/20">
                                                            {sub.learnerAddress.slice(2, 4).toUpperCase()}
                                                        </div>
                                                        <span className="font-mono text-xs text-slate-400">{sub.learnerAddress.slice(0, 10)}...</span>
                                                    </div>
                                                </td>
                                                <td className="py-5 px-6">
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-sm">Task #{sub.taskId}</span>
                                                        <a href={sub.proofUrl} target="_blank" rel="noreferrer" className="text-primary text-[10px] flex items-center gap-1 hover:underline">
                                                            View Evidence <ExternalLink size={10} />
                                                        </a>
                                                    </div>
                                                </td>
                                                <td className="py-5 px-6 font-bold text-[10px]">
                                                    <span className={`px-2 py-1 rounded inline-block ${sub.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' :
                                                        sub.status === 'approved' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                                                            'bg-red-500/10 text-red-500 border border-red-500/20'
                                                        }`}>
                                                        {sub.status.toUpperCase()}
                                                    </span>
                                                </td>
                                                <td className="py-5 px-6 text-right">
                                                    {sub.status === 'pending' ? (
                                                        <div className="flex justify-end gap-2">
                                                            <button
                                                                onClick={() => handleVerify(sub._id, 'approved', sub.learnerAddress, sub.taskId)}
                                                                className="w-8 h-8 rounded-lg bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white flex items-center justify-center transition-all border border-green-500/20"
                                                            >
                                                                <CheckCircle size={16} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleVerify(sub._id, 'rejected')}
                                                                className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all border border-red-500/20"
                                                            >
                                                                <XCircle size={16} />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <span className="text-slate-600 italic text-[10px]">Settled</span>
                                                    )}
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </AnimatePresence>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
