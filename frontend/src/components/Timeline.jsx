import React from 'react';

const Timeline = ({ logs }) => {
    if (!logs) return null;

    return (
        <div className="bg-surface p-6 rounded-lg shadow-lg border border-gray-800">
            <h2 className="text-xl font-semibold mb-4 text-text">Activity Timeline</h2>
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {logs.map((log, idx) => (
                    <div key={idx} className="flex gap-4">
                        <div className="flex flex-col items-center">
                            <div className="w-3 h-3 bg-primary rounded-full mt-1.5"></div>
                            {idx !== logs.length - 1 && <div className="w-0.5 bg-gray-800 h-full my-1"></div>}
                        </div>
                        <div className="flex-1 pb-4">
                            <div className="flex justify-between items-center mb-1">
                                <span className="font-semibold text-text">{log.message}</span>
                                <span className="text-xs text-textSecondary">{new Date(log.timestamp * 1000).toLocaleTimeString()}</span>
                            </div>
                            {log.details && (
                                <pre className="bg-black/30 p-2 rounded text-xs text-gray-400 font-mono overflow-x-auto whitespace-pre-wrap">
                                    {log.details.length > 300 ? log.details.substring(0, 300) + '...' : log.details}
                                </pre>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Timeline;
