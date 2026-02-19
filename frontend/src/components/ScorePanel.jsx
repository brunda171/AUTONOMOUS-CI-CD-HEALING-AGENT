import React from 'react';

const ScorePanel = ({ score }) => {
    return (
        <div className="bg-surface p-6 rounded-lg shadow-lg border border-gray-800 text-center">
            <h2 className="text-xl font-semibold mb-2 text-text">Current Score</h2>
            <div className="text-6xl font-black text-primary my-4">
                {score}
            </div>
            <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
                <div
                    className="bg-primary h-full transition-all duration-500"
                    style={{ width: `${Math.min(score, 100)}%` }}
                ></div>
            </div>
            <p className="text-textSecondary text-sm mt-2">Base: 100 | Speed Bonus applied automatically</p>
        </div>
    );
};

export default ScorePanel;
