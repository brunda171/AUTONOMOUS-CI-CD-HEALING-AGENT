import React from 'react';

const FixesTable = ({ fixes = [] }) => {
    if (!fixes || fixes.length === 0) return null;

    return (
        <div className="bg-surface p-6 rounded-lg shadow-lg border border-gray-800">
            <h2 className="text-xl font-semibold mb-4 text-text">Applied Fixes</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="border-b border-gray-700">
                        <tr>
                            <th className="p-2">File</th>
                            <th className="p-2">Message</th>
                            {/* <th className="p-2">Line</th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {fixes.map((fix, idx) => (
                            <tr key={idx} className="border-b border-gray-800 hover:bg-white/5">
                                <td className="p-2 font-mono text-primary">{fix.file}</td>
                                <td className="p-2">{fix.message}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default FixesTable;
