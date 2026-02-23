import { useState } from 'react';

const Home = () => {
    const [message, setMessage] = useState<string>('');
    const [dbStatus, setDbStatus] = useState<boolean | null>(null);
    const [dbError, setDbError] = useState<string | null>(null);

    const fetchMessage = () => {
        // Fetch message from the backend API when the button is clicked
        fetch('/api/message')
            .then((res) => res.json())
            .then((data) => {
                setMessage(data.message);
                setDbStatus(data.databaseConnected);
                setDbError(data.error || null);
            })
            .catch((err) => console.error('Error fetching data:', err));
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-4xl font-bold">Welcome to MERN App</h1>
            <p className="mt-4 text-lg text-gray-600">This is the Home Page</p>

            <button
                onClick={fetchMessage}
                className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center gap-2"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm11 1H6v8l4-2 4 2V6z" clipRule="evenodd" />
                </svg>
                Get Backend Status
            </button>

            {message && (
                <div className="mt-8 p-6 bg-white border border-gray-200 rounded-xl shadow-lg w-full max-w-md text-center transform transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-xl">
                    <div className="bg-linear-to-r from-blue-50 to-indigo-50 p-4 rounded-lg mb-4">
                        <p className="font-bold text-gray-700 text-xl mb-1">Backend says:</p>
                        <p className="text-lg text-indigo-600 font-medium">{message}</p>
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex flex-col items-center">
                        <p className="font-bold text-gray-600 mb-3 uppercase tracking-wider text-sm flex items-center gap-2">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>
                            Database Connection
                        </p>
                        <div className={`inline-flex items-center px-4 py-2 rounded-full text-white font-bold shadow-sm transition-colors ${dbStatus ? 'bg-linear-to-r from-green-400 to-green-500' : 'bg-linear-to-r from-red-400 to-red-500'}`}>
                            {dbStatus ? (
                                <>
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    Connected
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                    Disconnected
                                </>
                            )}
                        </div>

                        {dbError && (
                            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg w-full text-left">
                                <p className="text-red-800 text-sm font-semibold mb-1 flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    Connection Error Details:
                                </p>
                                <p className="text-red-600 text-xs font-mono break-all font-medium bg-red-100 p-2 rounded">{dbError}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
