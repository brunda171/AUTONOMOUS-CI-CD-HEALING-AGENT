import React from 'react';
import { motion } from 'framer-motion';
import { FileCode, Check } from 'lucide-react';

const FixesTable = ({ fixes = [] }) => {
    if (!fixes || fixes.length === 0) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-surface/50 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-lg"
        >
            <h2 className="text-sm font-bold mb-4 text-textSecondary uppercase tracking-wider flex items-center gap-2">
                <FileCode className="w-4 h-4" />
                Applied Fixes
            </h2>
            <div className="overflow-hidden rounded-xl border border-white/5">
                <table className="w-full text-left text-sm">
                    <thead className="bg-black/20 text-textSecondary">
                        <tr>
                            <th className="p-4 font-semibold">File</th>
                            <th className="p-4 font-semibold">Commit Message</th>
                        </tr>
                    </thead>
                    <tbody>
                        {fixes.map((fix, idx) => (
                            <tr key={idx} className="border-t border-white/5 hover:bg-white/5 transition-colors group">
                                <td className="p-4 font-mono text-primary flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary group-hover:scale-125 transition-transform"></div>
                                    {fix.file}
                                </td>
                                <td className="p-4 text-white/80">{fix.message}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
};

export default FixesTable;
