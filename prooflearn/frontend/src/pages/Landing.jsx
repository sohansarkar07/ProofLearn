import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Award, ShieldCheck, Zap, ArrowRight, Sparkles, Globe, Cpu } from 'lucide-react';

const Landing = () => {
    const navigate = useNavigate();

    return (
        <div className="relative">
            {/* Background Glows */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-primary/20 blur-[120px] rounded-full pointer-events-none" />

            {/* Hero Section */}
            <section className="container mx-auto px-6 py-20 lg:py-32 relative z-10">
                <div className="text-center max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel mb-8 border-primary/20 bg-primary/5 text-primary text-sm font-bold tracking-wider uppercase animate-glow-pulse"
                    >
                        <Sparkles size={16} />
                        The Future of Credentials
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-5xl md:text-8xl font-black mb-8 leading-[1.1] tracking-tight"
                    >
                        Prove Your Skills <br />
                        <span className="gradient-text drop-shadow-[0_0_15px_rgba(34,211,238,0.4)]">On-Chain.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed"
                    >
                        Turn your real-world expertise into immutable NFT certificates.
                        A verification layer for the NEXT generation of Web3 talent.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="flex flex-col sm:flex-row justify-center gap-6"
                    >
                        <button onClick={() => navigate('/marketplace')} className="btn-neon-primary px-10 py-5 text-lg group">
                            Explore Tasks
                            <ArrowRight className="inline-block ml-2 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button onClick={() => navigate('/profile')} className="btn-neon-secondary px-10 py-5 text-lg">
                            My Portfolio
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="container mx-auto px-6 py-24 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        {
                            icon: <Zap className="text-primary" size={32} />,
                            title: "Real Tasks",
                            desc: "Complete production-grade challenges and prove your capabilities.",
                            glow: "group-hover:shadow-[0_0_30px_rgba(34,211,238,0.15)]"
                        },
                        {
                            icon: <ShieldCheck className="text-secondary" size={32} />,
                            title: "Human Verified",
                            desc: "Expert review ensures only the highest quality work gets minted.",
                            glow: "group-hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]"
                        },
                        {
                            icon: <Award className="text-accent" size={32} />,
                            title: "NFT Credentials",
                            desc: "Earn soulbound-style NFT certificates for your Web3 resume.",
                            glow: "group-hover:shadow-[0_0_30px_rgba(236,72,153,0.15)]"
                        }
                    ].map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ y: -10 }}
                            className={`group neon-card p-10 bg-surface/30 ${feature.glow}`}
                        >
                            <div className="mb-6 p-3 w-fit rounded-xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform">
                                {feature.icon}
                            </div>
                            <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                            <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Tech Stats (Decoration) */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        </div>
    );
};

export default Landing;
