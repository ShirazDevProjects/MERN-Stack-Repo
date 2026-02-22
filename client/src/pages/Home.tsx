import { useState } from 'react';

const Home = () => {
    const [message, setMessage] = useState<string>('');

    const fetchMessage = () => {
        // Fetch message from the backend API when the button is clicked
        fetch('/api/message')
            .then((res) => res.json())
            .then((data) => setMessage(data.message))
            .catch((err) => console.error('Error fetching data:', err));
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-4xl font-bold">Welcome to MERN Stack App</h1>
            <p className="mt-4 text-lg text-gray-600">This is the Home Page</p>

            <button
                onClick={fetchMessage}
                className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
                Get Backend Message
            </button>

            {message && (
                <div className="mt-8 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg shadow-md">
                    <p className="font-semibold">Backend says:</p>
                    <p>{message}</p>
                </div>
            )}
        </div>
    );
};

export default Home;
