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

const Dashboard: React.FC = () => {
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
                const response = await fetch('http://localhost:8090/api/logs', {
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
                } else {
                    setLogs([]);
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
            } finally {
                console.log('Finally block executed.');
                setLoading(false);
            }
        };

        fetchLogs();

        return () => {
            abortController.abort();
        };
    }, []);

    if (loading) {
        return <div className="dashboard">Loading logs...</div>;
    }

    if (error) {
        return <div className="dashboard">Error: {error}</div>;
    }

    return (
        <div className="dashboard">
            <h2>PocketBase Logs</h2>
            <div className="logs-container">
                {logs.length === 0 ? (
                    <p>No logs found</p>
                ) : (
                    logs.map((log) => {
                        console.log(`Log ID: ${log.id}, Level: ${log.level}, Type of Level: ${typeof log.level}`);
                        return (
                        <div key={log.id} className="log-entry">
                            <div className="log-header">
                                <span className={`log-level ${String(log.level || '').toLowerCase()}`}>{String(log.level || '')}</span>
                                <span className="log-date">
                                    {new Date(log.created).toLocaleString()}
                                </span>
                            </div>
                            <div className="log-message">{log.message}</div>
                        </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default Dashboard;