import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useWeb3 } from '../context/Web3Context';
import { motion } from 'framer-motion';
import { Send, Link as LinkIcon, CheckCircle2, ChevronLeft, Shield } from 'lucide-react';

const SubmitTask = () => {
    const { taskId } = useParams();
    const { account } = useWeb3();
    const navigate = useNavigate();
    const [proofUrl, setProofUrl] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!account) return alert("Please connect wallet!");

        const apiUrl = import.meta.env.VITE_API_URL || '';
        try {
            await axios.post(`${apiUrl}/api/submissions`, {
                taskId,
                learnerAddress: account,
                proofUrl
            });
            alert("Submission success! Waiting for admin verification.");
            navigate('/profile');
        } catch (error) {
            console.error(error);
            alert("Submission failed");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto px-6 py-12 flex justify-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-2xl"
            >
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-slate-500 hover:text-white mb-8 transition-colors group"
                >
                    <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Marketplace
                </button>

                <div className="neon-card bg-mesh-gradient p-10 md:p-16 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                        <Shield size={120} className="text-primary" />
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary border border-primary/30">
                                <Send size={24} />
                            </div>
                            <div>
                                <h1 className="text-3xl font-black uppercase tracking-tight">Mission Submission</h1>
                                <p className="text-primary font-mono text-sm leading-none">TASK ID: #{taskId}</p>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="p-6 glass-panel bg-white/5 border-white/5">
                                <div className="flex items-center gap-3 mb-4 text-green-400 font-bold">
                                    <CheckCircle2 size={18} />
                                    <span className="text-sm uppercase tracking-wider">Requirements Verified</span>
                                </div>
                                <p className="text-slate-400 text-sm">Submit your final work URL (GitHub Repo, Vercel Link, or Document). Our AI and human experts will review your proof of work.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-3">
                                    <label className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase tracking-widest px-1">
                                        <LinkIcon size={14} />
                                        Work URL
                                    </label>
                                    <input
                                        type="url"
                                        placeholder="https://github.com/your-username/project-repo"
                                        value={proofUrl}
                                        onChange={(e) => setProofUrl(e.target.value)}
                                        required
                                        className="w-full input-neon py-4 text-lg"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting || !account}
                                    className={`w-full btn-neon-primary py-5 text-xl flex items-center justify-center gap-3 ${(!account || isSubmitting) && 'opacity-50 cursor-not-allowed'}`}
                                >
                                    {isSubmitting ? (
                                        <div className="w-6 h-6 border-2 border-background/30 border-t-background animate-spin rounded-full" />
                                    ) : (
                                        <>
                                            Submit Proof On-Chain
                                            <Send size={20} />
                                        </>
                                    )}
                                </button>

                                {!account && (
                                    <p className="text-center text-accent text-sm font-bold flex items-center justify-center gap-2">
                                        <Shield size={14} />
                                        Please connect your wallet to submit missions
                                    </p>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default SubmitTask;
