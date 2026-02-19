import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, ChevronRight, Activity } from 'lucide-react';

const Timeline = ({ logs }) => {
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs]);

    if (!logs) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-[#0c0c0e] backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl flex flex-col h-[500px] overflow-hidden"
        >
            <div className="bg-white/5 p-4 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-textSecondary">
                    <Terminal className="w-4 h-4" />
                    <span className="text-xs font-mono uppercase tracking-widest">Live Execution Logs</span>
                </div>
                <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 font-mono text-sm space-y-4 custom-scrollbar" ref={scrollRef}>
                <AnimatePresence>
                    {logs.map((log, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2 }}
                            className="group"
                        >
                            <div className="flex gap-3 text-white/80">
                                <span className="text-gray-600 text-xs mt-0.5 whitespace-nowrap">
                                    {new Date(log.timestamp * 1000).toLocaleTimeString()}
                                </span>
                                <div className="flex-1">
                                    <div className={`flex items-center gap-2 ${log.message.includes("FAILED") ? 'text-error' : log.message.includes("PASSED") ? 'text-success' : 'text-primary'}`}>
                                        <ChevronRight className="w-3.5 h-3.5" />
                                        <span className="font-bold">{log.message}</span>
                                    </div>
                                    {log.details && (
                                        <div className="mt-2 pl-6 border-l-2 border-white/10 ml-1.5">
                                            <pre className="text-xs text-gray-400 whitespace-pre-wrap font-mono break-all leading-relaxed">
                                                {log.details}
                                            </pre>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                    {logs.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center text-gray-600 gap-4 opacity-50">
                            <Activity className="w-12 h-12" />
                            <span className="text-sm">Waiting for agent execution...</span>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default Timeline;
