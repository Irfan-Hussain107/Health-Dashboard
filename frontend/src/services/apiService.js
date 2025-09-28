import axios from 'axios';

// The URL for your Python backend. 
// Make sure your backend is running on this port.
const API_URL = 'http://127.0.0.1:8000/api';

/**
 * Fetches the report card data from the backend.
 * @param {string} address The address to get the report for.
 * @returns {Promise<object>} The report card data.
 */
export const fetchReportCard = async (address) => {
    try {
        const response = await axios.post(`${API_URL}/report-card`, {
            address: address,
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching report card:", error);
        // Rethrow the error to be handled by the component
        throw new Error("Could not fetch data from the server. Is it running?");
    }
};