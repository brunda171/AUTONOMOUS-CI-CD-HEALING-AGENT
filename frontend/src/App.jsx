import React, { useState, useEffect, useRef } from 'react';
import InputSection from './components/InputSection';
import RunSummary from './components/RunSummary';
import ScorePanel from './components/ScorePanel';
import FixesTable from './components/FixesTable';
import Timeline from './components/Timeline';
import { Activity, Zap, Terminal } from 'lucide-react';

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
        };

        return () => {
            if (ws) ws.close();
        };
    }, [jobId]);

    return (
        <div className="min-h-screen w-full text-text p-6 flex flex-col gap-8 font-sans">
            <header className="max-w-7xl mx-auto w-full flex items-center gap-3 py-4">
                <div className="p-3 bg-primary/20 rounded-xl border border-primary/20 backdrop-blur-sm">
                    <Zap className="w-8 h-8 text-primary" />
                </div>
                <div>
                    <h1 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-blue-500 tracking-tight">
                        NXTgen Healer
                    </h1>
                    <p className="text-textSecondary text-sm font-medium tracking-wide">AUTONOMOUS CI/CD REPAIR AGENT</p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full max-w-7xl mx-auto flex-1">

                {/* Left Column: Input and Score */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                    <InputSection onSubmit={startAgent} isLoading={loading} disabled={!!jobId && loading} />
                    <ScorePanel score={statusData?.score || 100} status={statusData?.status} />
                </div>

                {/* Right Column: Status, Timeline, Fixes */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                    {error && (
                        <div className="p-4 bg-error/10 text-error border border-error/20 rounded-xl backdrop-blur-sm flex items-center gap-2">
                            <Activity className="w-5 h-5" />
                            {error}
                        </div>
                    )}

                    <div className="flex flex-col gap-6 h-full">
                        <RunSummary data={statusData || {}} />

                        <div className="grid grid-cols-1 gap-6 flex-1">
                            <Timeline logs={statusData?.logs} />
                            {statusData?.fixes?.length > 0 && (
                                <FixesTable fixes={statusData.fixes} />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
