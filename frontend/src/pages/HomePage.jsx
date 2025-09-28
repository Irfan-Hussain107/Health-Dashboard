import { useState } from 'react';
import AddressInput from '../components/AddressInput';
import ReportCard from '../components/ReportCard';
// We import the mock data to use it for development
import { mockReportData } from '../mockData'; // Make sure the path is correct

// We can comment out the real API service for now
// import { fetchReportCard } from '../services/apiService.js';

function HomePage() {
    // We set the initial state to our mock data instead of null
    // This makes the ReportCard render immediately
    const [reportData, setReportData] = useState(mockReportData);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // This function is now just a placeholder
    const handleSearch = async (address) => {
        console.log("Search is disabled while using mock data. You are seeing a static report.");
        // To re-enable, set initial state back to null and uncomment the code below
        /*
        if (!address) {
            setError('Please enter an address.');
            return;
        }
        setIsLoading(true);
        setError('');
        setReportData(null);

        try {
            const data = await fetchReportCard(address);
            setReportData(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
        */
    };

    return (
        <main className="container mx-auto px-4 py-8">
            <header className="text-center mb-8">
                <h1 className="text-4xl md:text-5xl font-bold text-cyan-400">EcoCode</h1>
                <p className="text-gray-400 mt-2">Your Hyperlocal Environmental Health Report Card</p>
            </header>

            <AddressInput onSearch={handleSearch} isLoading={isLoading} />

            {isLoading && (
                <div className="text-center mt-8">
                    <p className="text-xl">Generating your report...</p>
                </div>
            )}

            {error && (
                <div className="text-center mt-8 bg-red-900/50 p-4 rounded-lg">
                    <p className="text-xl text-red-400">Error: {error}</p>
                </div>
            )}

            {reportData && (
                <div className="mt-8">
                    <ReportCard data={reportData} />
                </div>
            )}
        </main>
    );
}

export default HomePage;