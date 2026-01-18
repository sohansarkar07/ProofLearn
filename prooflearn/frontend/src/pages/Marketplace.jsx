import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, ChevronRight, Star, Clock, Trophy } from 'lucide-react';

const Marketplace = () => {
    const [tasks, setTasks] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTasks = async () => {
            const res = await axios.get('http://localhost:5000/api/tasks');
            setTasks(res.data);
        };
        fetchTasks();
    }, []);

    return (
        <div className="container mx-auto px-6 py-12 relative">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                <div className="max-w-xl">
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-4xl md:text-6xl font-black mb-4 gradient-text"
                    >
                        Skill Missions
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-slate-400 text-lg"
                    >
                        Accept real-world challenges from top Web3 projects and earn on-chain credentials.
                    </motion.p>
                </div>
                <div className="glass-panel px-6 py-3 flex items-center gap-4 border-primary/20 bg-primary/5">
                    <ShoppingBag className="text-primary" />
                    <span className="font-bold">{tasks.length} Available Tasks</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {tasks.map((task, i) => (
                    <motion.div
                        key={task.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        whileHover={{ y: -5 }}
                        className="neon-card p-1 group flex flex-col h-full"
                    >
                        <div className="bg-surface/60 p-8 rounded-[inherit] flex flex-col h-full bg-mesh-gradient">
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-primary">
                                    <Trophy size={20} />
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-1">Reward</span>
                                    <span className="text-xl font-black text-primary font-mono">{task.rewardAmount} XP</span>
                                </div>
                            </div>

                            <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">{task.name}</h3>
                            <p className="text-slate-400 mb-8 flex-grow leading-relaxed">{task.description}</p>

                            <div className="flex items-center gap-4 mb-8 text-sm font-semibold text-slate-500">
                                <span className="flex items-center gap-1"><Clock size={14} /> 48h</span>
                                <span className="flex items-center gap-1"><Star size={14} /> Intermediate</span>
                            </div>

                            <button
                                onClick={() => navigate(`/submit/${task.id}`)}
                                className="w-full btn-neon-primary flex items-center justify-center gap-2 group/btn"
                            >
                                Start Mission
                                <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {tasks.length === 0 && (
                <div className="text-center py-24 glass-panel border-dashed border-white/5">
                    <p className="text-slate-500 italic text-xl">Loading skill missions from the database...</p>
                </div>
            )}
        </div>
    );
};

export default Marketplace;
