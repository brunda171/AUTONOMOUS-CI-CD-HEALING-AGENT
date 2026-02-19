import React from 'react';

const RunSummary = ({ data }) => {
    const statusColor = data.status === 'PASSED' ? 'text-success border-success' :
        data.status === 'FAILED' ? 'text-error border-error' : 'text-primary border-primary';

    return (
        <div className="bg-surface p-6 rounded-lg shadow-lg border border-gray-800">
            <h2 className="text-xl font-semibold mb-4 text-text">Live Status</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex flex-col">
                    <span className="text-textSecondary text-sm">Status</span>
                    <span className={`font-bold border px-2 py-1 rounded inline-block w-fit mt-1 ${statusColor}`}>{data.status}</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-textSecondary text-sm">Branch</span>
                    <span className="font-mono text-sm mt-1 truncate">{data.branch_name || '-'}</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-textSecondary text-sm">Total Fixes</span>
                    <span className="font-bold mt-1">{data.total_fixes || 0}</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-textSecondary text-sm">Duration</span>
                    <span className="font-bold mt-1 text-primary">
                        {data.time_taken ? `${data.time_taken.toFixed(1)}s` : '...'}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default RunSummary;
