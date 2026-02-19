import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Timer, TrendingUp } from 'lucide-react';

const ScorePanel = ({ score, status }) => {
    const [displayScore, setDisplayScore] = useState(0);

    useEffect(() => {
        // Simple counter animation
        let start = displayScore;
        const end = score;
        const duration = 1000;
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // East out quart
            const ease = 1 - Math.pow(1 - progress, 4);

            setDisplayScore(Math.floor(start + (end - start) * ease));

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [score]);

    const getColor = (s) => {
        if (s >= 90) return 'text-success';
        if (s >= 70) return 'text-primary';
        return 'text-error';
    };

    const getGradient = (s) => {
        if (s >= 90) return 'from-success to-emerald-400';
        if (s >= 70) return 'from-primary to-violet-400';
        return 'from-error to-rose-400';
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-surface/50 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 p-3 opacity-10">
                <Trophy className="w-32 h-32 rotate-12" />
            </div>

            <h2 className="text-xl font-bold mb-6 text-white flex items-center gap-2 relative z-10">
                <TrendingUp className="w-5 h-5 text-yellow-400" />
                Performance Score
            </h2>

            <div className="flex flex-col items-center justify-center relative z-10 py-4">
                <div className="relative">
                    <svg className="w-48 h-48 transform -rotate-90">
                        <circle
                            cx="96"
                            cy="96"
                            r="88"
                            fill="transparent"
                            stroke="currentColor"
                            strokeWidth="12"
                            className="text-gray-800"
                        />
                        <circle
                            cx="96"
                            cy="96"
                            r="88"
                            fill="transparent"
                            stroke="currentColor"
                            strokeWidth="12"
                            strokeDasharray={2 * Math.PI * 88}
                            strokeDashoffset={2 * Math.PI * 88 * (1 - displayScore / 100)}
                            strokeLinecap="round"
                            className={`${getColor(displayScore)} transition-all duration-1000 ease-out`}
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                        <span className={`text-6xl font-black bg-clip-text text-transparent bg-gradient-to-br ${getGradient(displayScore)}`}>
                            {displayScore}
                        </span>
                        <span className="text-textSecondary text-xs tracking-widest uppercase mt-2 font-semibold">Points</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-black/20 rounded-xl p-3 text-center border border-white/5">
                    <div className="text-xs text-textSecondary uppercase mb-1">Status</div>
                    <div className={`font-bold ${status === 'PASSED' ? 'text-success' : status === 'FAILED' ? 'text-error' : 'text-primary'}`}>
                        {status || 'WAITING'}
                    </div>
                </div>
                <div className="bg-black/20 rounded-xl p-3 text-center border border-white/5">
                    <div className="text-xs text-textSecondary uppercase mb-1">Bonus</div>
                    <div className="font-bold text-yellow-400">+20 Speed</div>
                </div>
            </div>
        </motion.div>
    );
};

export default ScorePanel;
