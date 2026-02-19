import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Github, Users, User, Loader2 } from 'lucide-react';

const InputSection = ({ onSubmit, isLoading, disabled }) => {
    const [formData, setFormData] = useState({
        repo_url: '',
        team_name: '',
        leader_name: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-surface/50 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden group"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-50 group-hover:opacity-100 transition-opacity pointer-events-none" />

            <h2 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
                <Github className="w-5 h-5" />
                Configuration components
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5 relative z-10">
                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-textSecondary uppercase tracking-wider ml-1">Repository URL</label>
                    <div className="relative">
                        <Github className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                        <input
                            type="text"
                            name="repo_url"
                            required
                            className="w-full bg-black/20 border border-white/10 rounded-xl p-3 pl-10 focus:ring-2 focus:ring-primary/50 focus:border-primary/50 outline-none transition-all placeholder:text-gray-600 text-sm"
                            placeholder="https://github.com/user/repo"
                            value={formData.repo_url}
                            onChange={handleChange}
                            disabled={disabled}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-textSecondary uppercase tracking-wider ml-1">Team Name</label>
                        <div className="relative">
                            <Users className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                            <input
                                type="text"
                                name="team_name"
                                required
                                className="w-full bg-black/20 border border-white/10 rounded-xl p-3 pl-10 focus:ring-2 focus:ring-primary/50 outline-none transition-all text-sm"
                                placeholder="NXTgen"
                                value={formData.team_name}
                                onChange={handleChange}
                                disabled={disabled}
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-textSecondary uppercase tracking-wider ml-1">Leader</label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                            <input
                                type="text"
                                name="leader_name"
                                required
                                className="w-full bg-black/20 border border-white/10 rounded-xl p-3 pl-10 focus:ring-2 focus:ring-primary/50 outline-none transition-all text-sm"
                                placeholder="Manushree"
                                value={formData.leader_name}
                                onChange={handleChange}
                                disabled={disabled}
                            />
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={disabled || isLoading}
                    className={`mt-4 py-4 px-6 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/25
            ${disabled
                            ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-white/5'
                            : 'bg-gradient-to-r from-primary to-secondary hover:scale-[1.02] active:scale-[0.98] text-white border border-white/10'
                        }`}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Agent Running...
                        </>
                    ) : (
                        <>
                            <Play className="w-5 h-5 fill-current" />
                            Start Autonomous Agent
                        </>
                    )}
                </button>
            </form>
        </motion.div>
    );
};

export default InputSection;
