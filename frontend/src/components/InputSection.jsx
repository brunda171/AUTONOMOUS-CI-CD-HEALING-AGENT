import React, { useState } from 'react';

const InputSection = ({ onSubmit, isLoading }) => {
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
        <div className="bg-surface p-6 rounded-lg shadow-lg border border-gray-800">
            <h2 className="text-xl font-semibold mb-4 text-primary">Start New Agent</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                    <label className="block text-sm text-textSecondary mb-1">GitHub Repo URL</label>
                    <input
                        type="text"
                        name="repo_url"
                        required
                        className="w-full bg-background border border-gray-700 rounded p-2 focus:ring-2 focus:ring-primary outline-none"
                        placeholder="https://github.com/user/repo"
                        value={formData.repo_url}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label className="block text-sm text-textSecondary mb-1">Team Name</label>
                    <input
                        type="text"
                        name="team_name"
                        required
                        className="w-full bg-background border border-gray-700 rounded p-2 focus:ring-2 focus:ring-primary outline-none"
                        placeholder="NeonHackers"
                        value={formData.team_name}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label className="block text-sm text-textSecondary mb-1">Leader Name</label>
                    <input
                        type="text"
                        name="leader_name"
                        required
                        className="w-full bg-background border border-gray-700 rounded p-2 focus:ring-2 focus:ring-primary outline-none"
                        placeholder="Alice"
                        value={formData.leader_name}
                        onChange={handleChange}
                    />
                </div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className={`mt-2 py-2 px-4 rounded font-bold transition-all ${isLoading ? 'bg-gray-600 cursor-not-allowed' : 'bg-primary hover:bg-indigo-600'}`}
                >
                    {isLoading ? 'Running Agent...' : 'Run Agent'}
                </button>
            </form>
        </div>
    );
};

export default InputSection;
