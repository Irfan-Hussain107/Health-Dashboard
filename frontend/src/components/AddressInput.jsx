import { useState } from 'react';

function AddressInput({ onSearch, isLoading }) {
    const [address, setAddress] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(address);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto">
            <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your full address in Delhi..."
                className="flex-grow p-3 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                disabled={isLoading}
            />
            <button
                type="submit"
                className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold p-3 rounded-md transition duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed"
                disabled={isLoading}
            >
                {isLoading ? 'Analyzing...' : 'Get Report'}
            </button>
        </form>
    );
}

export default AddressInput;