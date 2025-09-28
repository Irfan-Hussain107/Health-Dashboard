import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';
import * as cheerio from 'cheerio';

dotenv.config();

const app = express();
const PORT = process.env.SERVER_PORT || 3001;

app.use(cors());
app.use(express.json());

// --- Real-Time Data Fetching Functions ---

async function getCoordinatesForAddress(address) {
    if (!process.env.LOCATIONIQ_API_KEY) throw new Error("LocationIQ API key is missing.");
    const url = `https://us1.locationiq.com/v1/search.php?key=${process.env.LOCATIONIQ_API_KEY}&q=${encodeURIComponent(address)}&format=json&limit=1`;
    const response = await axios.get(url);
    if (response.data && response.data.length > 0) {
        return { lat: response.data[0].lat, lon: response.data[0].lon };
    }
    throw new Error('Could not find coordinates for the address.');
}

async function getAddressForCoordinates(lat, lon) {
    if (!process.env.LOCATIONIQ_API_KEY) throw new Error("LocationIQ API key is missing.");
    const url = `https://us1.locationiq.com/v1/reverse.php?key=${process.env.LOCATIONIQ_API_KEY}&lat=${lat}&lon=${lon}&format=json`;
    const response = await axios.get(url);
    if (response.data && response.data.display_name) {
        return response.data.display_name;
    }
    return `${lat}, ${lon}`;
}

async function getRealtimeAQI(lat, lon) {
    try {
        if (!process.env.OPENAQ_API_KEY) throw new Error("OpenAQ API key is missing. Trying fallback.");
        const url = `https://api.openaq.org/v3/latest?coordinates=${lat},${lon}&radius=25000&limit=10`;
        const response = await axios.get(url, { headers: { 'X-API-Key': process.env.OPENAQ_API_KEY } });
        if (response.data.results && response.data.results.length > 0) {
            const measurements = response.data.results;
            let pm25 = 0, pm10 = 0;
            for (const measurement of measurements) {
                if (measurement.parameter === 'pm25') pm25 = measurement.value || 0;
                if (measurement.parameter === 'pm10') pm10 = measurement.value || 0;
            }
            const aqi = calculateAQI(pm25, pm10);
            console.log("Fetched data from OpenAQ successfully.");
            return { aqi, pm25, pm10 };
        }
    } catch (error) {
        console.error('OpenAQ API error:', error.message, "Attempting fallback.");
    }
    try {
        if (!process.env.WAQI_API_KEY) throw new Error("WAQI API key is missing.");
        const url = `https://api.waqi.info/feed/geo:${lat};${lon}/?token=${process.env.WAQI_API_KEY}`;
        const response = await axios.get(url);
        if (response.data.status === 'ok') {
            const data = response.data.data;
            const aqi = data.aqi || 0;
            const pm25 = data.iaqi?.pm25?.v || 0;
            const pm10 = data.iaqi?.pm10?.v || 0;
            console.log("Fetched data from WAQI successfully.");
            return { aqi, pm25, pm10 };
        }
    } catch (error) {
        console.error('Fallback WAQI API error:', error.message);
    }
    throw new Error("Both primary and fallback AQI services failed.");
}

function calculateAQI(pm25, pm10) {
    const pm25Breakpoints = [
        {low: 0, high: 12, aqiLow: 0, aqiHigh: 50},
        {low: 12.1, high: 35.4, aqiLow: 51, aqiHigh: 100},
        {low: 35.5, high: 55.4, aqiLow: 101, aqiHigh: 150},
        {low: 55.5, high: 150.4, aqiLow: 151, aqiHigh: 200},
        {low: 150.5, high: 250.4, aqiLow: 201, aqiHigh: 300},
        {low: 250.5, high: 500, aqiLow: 301, aqiHigh: 500}
    ];
    let breakpoint = pm25Breakpoints[0];
    for (const bp of pm25Breakpoints) {
        if (pm25 >= bp.low && pm25 <= bp.high) {
            breakpoint = bp;
            break;
        }
    }
    const aqi = ((breakpoint.aqiHigh - breakpoint.aqiLow) / (breakpoint.high - breakpoint.low)) * (pm25 - breakpoint.low) + breakpoint.aqiLow;
    return Math.round(aqi);
}

async function getCivicComplaintsAndNoise() {
    const mockHtml = `
        <div>
            <div class="complaint">Waste not collected for 3 days.</div>
            <div class="complaint">Loud music from wedding hall at night.</div>
            <div class="complaint">Pothole on main road causing issues.</div>
            <div class="complaint">Construction noise is unbearable.</div>
        </div>
    `;
    const $ = cheerio.load(mockHtml);
    const complaints = [];
    $('.complaint').each((i, el) => {
        complaints.push($(el).text());
    });
    let noiseComplaintsCount = 0;
    complaints.forEach(text => {
        if (text.toLowerCase().includes('noise') || text.toLowerCase().includes('loud')) {
            noiseComplaintsCount++;
        }
    });
    const noiseLevel = { day: 55 + noiseComplaintsCount * 5, night: 45 + noiseComplaintsCount * 5 };
    return { complaints, noiseLevel };
}

app.post('/api/report-card', async (req, res) => {
    const { address } = req.body;
    if (!address) return res.status(400).json({ error: 'Address is required' });

    console.log(`Received real-time request for: ${address}`);

    try {
        let coordinates;
        let displayLocation;
        const parts = address.split(',').map(part => parseFloat(part.trim()));

        if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
            console.log("Input is coordinates. Parsing and reverse geocoding...");
            coordinates = { lat: parts[0], lon: parts[1] };
            displayLocation = await getAddressForCoordinates(coordinates.lat, coordinates.lon);
        } else {
            console.log("Input is a text address. Geocoding...");
            coordinates = await getCoordinatesForAddress(address);
            displayLocation = address;
        }

        console.log("Using coordinates:", coordinates);
        const airQuality = await getRealtimeAQI(coordinates.lat, coordinates.lon);
        const { complaints, noiseLevel } = await getCivicComplaintsAndNoise();

        const mlServiceUrl = `${process.env.PYTHON_ML_API_URL}/categorize`;
        const mlResponse = await axios.post(mlServiceUrl, {
            text: complaints.length > 0 ? complaints[0] : "No complaints found."
        });
        const categoryFromML = mlResponse.data.category;

        const responseData = {
            location: displayLocation,
            overallScore: Math.floor(100 - (airQuality.aqi / 3)),
            airQuality: airQuality,
            noiseLevel: noiseLevel,
            civicComplaints: {
                total: complaints.length,
                resolved: Math.floor(complaints.length * 0.78),
                pending: Math.ceil(complaints.length * 0.22),
                categories: [
                    { name: categoryFromML, count: 1 },
                    { name: 'Other', count: complaints.length - 1 }
                ]
            }
        };
        res.json(responseData);
    } catch (error) {
        console.error("Error processing request:", error.message);
        res.status(500).json({ error: `Failed to fetch real-time data. Reason: ${error.message}` });
    }
});

app.listen(PORT, () => {
    console.log(`Express server running on http://localhost:${PORT}`);
});