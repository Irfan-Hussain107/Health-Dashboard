import axios from 'axios';

// Update this URL to point to your Express server
const API_URL = 'http://127.0.0.1:3001/api';

export const fetchReportCard = async (address) => {
    try {
        // The endpoint is now /report-card
        const response = await axios.post(`${API_URL}/report-card`, {
            address: address,
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching report card:", error);
        throw new Error("Could not fetch data from the server. Is it running?");
    }
};