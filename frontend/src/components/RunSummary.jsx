import React from 'react';
import { motion } from 'framer-motion';
import { GitBranch, Clock, Wrench, CheckCircle2, XCircle, Loader } from 'lucide-react';

const RunSummary = ({ data }) => {
    if (!data.status) return null;

    const getStatusIcon = () => {
        switch (data.status) {
            case 'PASSED': return <CheckCircle2 className="w-6 h-6 text-success" />;
            case 'FAILED': return <XCircle className="w-6 h-6 text-error" />;
            default: return <Loader className="w-6 h-6 text-primary animate-spin" />;
        }
    };

    const statusColor = data.status === 'PASSED' ? 'bg-success/10 border-success/20 text-success' :
        data.status === 'FAILED' ? 'bg-error/10 border-error/20 text-error' : 'bg-primary/10 border-primary/20 text-primary';

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-surface/50 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-lg"
        >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="flex flex-col gap-2">
                    <span className="text-textSecondary text-xs uppercase tracking-wider font-semibold">Current Status</span>
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border w-fit ${statusColor}`}>
                        {getStatusIcon()}
                        <span className="font-bold tracking-wide">{data.status}</span>
                    </div>
                </div>

                <div className="flex flex-col gap-2 relative">
                    <div className="absolute top-0 left-0 w-8 h-8 -ml-10 bg-white/5 rounded-full flex items-center justify-center opacity-50">
                        <GitBranch className="w-4 h-4 text-textSecondary" />
                    </div>
                    <span className="text-textSecondary text-xs uppercase tracking-wider font-semibold">Active Branch</span>
                    <span className="font-mono text-sm font-semibold text-white/90 bg-black/30 p-2 rounded-lg border border-white/5 truncate">
                        {data.branch_name || '...'}
                    </span>
                </div>

                <div className="flex flex-col gap-2 relative">
                    <div className="absolute top-0 left-0 w-8 h-8 -ml-10 bg-white/5 rounded-full flex items-center justify-center opacity-50">
                        <Wrench className="w-4 h-4 text-textSecondary" />
                    </div>
                    <span className="text-textSecondary text-xs uppercase tracking-wider font-semibold">Total Fixes</span>
                    <span className="text-2xl font-black text-white">{data.total_fixes || 0}</span>
                </div>

                <div className="flex flex-col gap-2 relative">
                    <div className="absolute top-0 left-0 w-8 h-8 -ml-10 bg-white/5 rounded-full flex items-center justify-center opacity-50">
                        <Clock className="w-4 h-4 text-textSecondary" />
                    </div>
                    <span className="text-textSecondary text-xs uppercase tracking-wider font-semibold">Time Elapsed</span>
                    <span className="text-2xl font-black text-primary">
                        {data.time_taken ? `${data.time_taken.toFixed(1)}s` : '0.0s'}
                    </span>
                </div>
            </div>
        </motion.div>
    );
};

export default RunSummary;
