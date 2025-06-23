import React, { useEffect, useState } from 'react';
import PocketBase from 'pocketbase';
import './dashboard.css';

const pb = new PocketBase('http://localhost:8090');

interface LogEntry {
    id: string;
    created: string;
    level: string;
    message: string;
    [key: string]: any;
}

// Mapping for log level numbers to descriptive text
const LOG_LEVEL_MAP: Record<string | number, string> = {
    '-4': 'DEBUG',
    '0': 'INFO',
    '4': 'WARN',
    '8': 'ERROR',
};

const Dashboard: React.FC = () => {
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [perPage] = useState(20); // You can make this adjustable if you want
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [hideHealthChecks, setHideHealthChecks] = useState(false);

    useEffect(() => {
        const abortController = new AbortController();
        const signal = abortController.signal;

        const fetchLogs = async () => {
            console.log('fetchLogs started');
            setLoading(true); 
            setError(null);   

            try {
                
                const email = process.env.REACT_APP_PB_SUPER_EMAIL;
                const password = process.env.REACT_APP_PB_SUPER_PW;
                
                if (!email || !password) {
                    throw new Error('Missing PocketBase superuser credentials. Please check your .env file contains REACT_APP_PB_SUPER_EMAIL and REACT_APP_PB_SUPER_PW');
                }

                console.log('Attempting authentication...');
                
                await pb.collection("_superusers").authWithPassword(email, password, { signal });
                console.log('Authentication successful');

                console.log('Attempting to fetch logs...');
                const response = await fetch(`http://localhost:8090/api/logs?page=${page}&perPage=${perPage}&sort=-created`, {
                    headers: {
                        'Authorization': pb.authStore.token
                    },
                    signal: signal 
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                
                const logsData = await response.json();
                console.log('Logs response:', logsData);
                
                if (logsData.items) {
                    setLogs(logsData.items);
                    setTotalPages(logsData.totalPages || 1);
                    setTotalItems(logsData.totalItems || 0);
                } else {
                    setLogs([]);
                    setTotalPages(1);
                    setTotalItems(0);
                }
                setError(null); 
                console.log('fetchLogs completed successfully');
            } catch (err: unknown) {
                console.log('Caught error:', { typeOfErr: typeof err, fullErr: err });

                if (err instanceof Error) { 
                    console.log('Error properties:', { name: err.name, message: err.message });
                    if (err.name === 'AbortError' || err.message.includes('autocancelled')) {
                        console.log('Request aborted (expected):', err.message);
                        return;
                    }
                } else if (typeof err === 'object' && err !== null && 'message' in err) {
                    
                    const msg = (err as { message?: string }).message;
                    if (msg && msg.includes('autocancelled')) {
                        console.log('Request aborted (expected - non-Error object with message):', msg);
                        return; 
                    }
                }

                console.error('Error in dashboard (unexpected):', err);
                setError(err instanceof Error ? err.message : 'An unknown error occurred during authentication or fetching logs.');
                setPage(1);
            } finally {
                console.log('Finally block executed.');
                setLoading(false);
            }
        };

        fetchLogs();

        return () => {
            abortController.abort();
        };
    }, [page, perPage]);

    const handlePrevPage = () => {
        setPage((prev) => Math.max(1, prev - 1));
    };
    const handleNextPage = () => {
        setPage((prev) => Math.min(totalPages, prev + 1));
    };
    const handleFirstPage = () => {
        setPage(1);
    };
    const handleLastPage = () => {
        setPage(totalPages);
    };

    if (loading) {
        return <div className="dashboard">Loading logs...</div>;
    }

    if (error) {
        return <div className="dashboard">Error: {error}</div>;
    }

    return (
        <div className="dashboard">
            <h2>PocketBase Logs</h2>
            <div className="switch-row">
                <label className="switch-label">
                    <span style={{marginRight: 10}}>Health requests verbergen</span>
                    <span className="switch">
                        <input
                            type="checkbox"
                            checked={hideHealthChecks}
                            onChange={() => setHideHealthChecks((v) => !v)}
                        />
                        <span className="slider" />
                    </span>
                </label>
            </div>
            <div className="logs-container">
                {
                    (logs.filter(log => {
                        if (!hideHealthChecks) return true;
                        const msg = (log.message || '').toLowerCase();
                        return !msg.includes('/api/health');
                    })).length === 0 ? (
                        <p>No logs found</p>
                    ) : (
                        logs.filter(log => {
                            if (!hideHealthChecks) return true;
                            const msg = (log.message || '').toLowerCase();
                            return !msg.includes('/api/health');
                        }).map((log) => {
                            let levelText = LOG_LEVEL_MAP[log.level] || String(log.level || '');
                            let levelClass = levelText.toLowerCase();
                            return (
                                <div key={log.id} className="log-entry">
                                    <div className="log-header">
                                        <span className={`log-level ${levelClass}`}>{levelText}</span>
                                        <span className="log-date">
                                            {new Date(log.created).toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="log-message">{log.message}</div>
                                </div>
                            );
                        })
                    )
                }
            </div>
            {/* Pagination Controls */}
            <div className="pagination-controls" style={{ marginTop: 20, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
                <button onClick={handleFirstPage} disabled={page === 1}>&laquo; Eerste</button>
                <button onClick={handlePrevPage} disabled={page === 1}>&lsaquo; Vorige</button>
                <button onClick={handleNextPage} disabled={page === totalPages}>&rsaquo; Volgende</button>
                <button onClick={handleLastPage} disabled={page === totalPages}>&raquo; Laatste</button>
                <span style={{ marginLeft: 16, color: '#888' }}>
                    Pagina {page} van {totalPages} ({totalItems} logs)
                </span>
            </div>
        </div>
    );
};

export default Dashboard;