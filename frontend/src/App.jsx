import React, { useState, useEffect, useRef } from 'react';
import InputSection from './components/InputSection';
import RunSummary from './components/RunSummary';
import ScorePanel from './components/ScorePanel';
import FixesTable from './components/FixesTable';
import Timeline from './components/Timeline';

function App() {
    const [jobId, setJobId] = useState(null);
    const [statusData, setStatusData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const socketRef = useRef(null);

    const startAgent = async (formData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:8000/run', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error('Failed to start agent');

            const data = await response.json();
            setJobId(data.job_id);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!jobId) return;

        // Connect to WebSocket
        const ws = new WebSocket(`ws://localhost:8000/ws/${jobId}`);
        socketRef.current = ws;

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setStatusData(data);
            if (data.status === 'PASSED' || data.status === 'FAILED') {
                setLoading(false);
            }
        };

        ws.onerror = (err) => {
            console.error('WebSocket error:', err);
            // Fallback to polling could be added here
        };

        return () => {
            if (ws) ws.close();
        };
    }, [jobId]);

    return (
        <div className="min-h-screen w-full bg-background text-text p-6 flex flex-col gap-6">
            <header className="mb-8">
                <h1 className="text-4xl font-bold text-primary mb-2">Autonomous CI/CD Healing Agent</h1>
                <p className="text-textSecondary">Hackathon Project - AI-Powered Code Repair</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full max-w-7xl mx-auto">

                {/* Left Column: Input and Score */}
                <div className="md:col-span-4 flex flex-col gap-6">
                    <InputSection onSubmit={startAgent} isLoading={loading} disabled={!!jobId && loading} />
                    {statusData && <ScorePanel score={statusData.score} status={statusData.status} />}
                </div>

                {/* Right Column: Status, Timeline, Fixes */}
                <div className="md:col-span-8 flex flex-col gap-6">
                    {error && <div className="p-4 bg-error/20 text-error border border-error rounded-lg">{error}</div>}

                    {statusData && (
                        <>
                            <RunSummary data={statusData} />
                            <Timeline logs={statusData.logs} />
                            <FixesTable fixes={statusData.fixes} totalFixes={statusData.total_fixes} />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default App;
