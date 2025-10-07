import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';
import * as cheerio from 'cheerio';
import noiseLevel from './src/services/noiseLevel.js';
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
const PORT = process.env.SERVER_PORT || 3001;
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.use(cors());
app.use(express.json());

async function getCoordinates(address) {
    // Try Google Geocoding
    if (process.env.GOOGLE_API_KEY) {
        try {
            const { data } = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
                params: { address, key: process.env.GOOGLE_API_KEY }
            });
            if (data.status === 'OK' && data.results[0]) {
                const { lat, lng } = data.results[0].geometry.location;
                console.log(`✅ Google Geocoding: ${address} -> ${lat}, ${lng}`);
                return { lat, lon: lng };
            }
        } catch (err) {
            console.error('Google Geocoding error:', err.message);
        }
    }
    
    // Fallback to LocationIQ
    if (!process.env.LOCATIONIQ_API_KEY) throw new Error("No geocoding API keys available");
    const { data } = await axios.get(`https://us1.locationiq.com/v1/search.php`, {
        params: { key: process.env.LOCATIONIQ_API_KEY, q: address, format: 'json', limit: 1 }
    });
    if (data && data.length > 0) return { lat: data[0].lat, lon: data[0].lon };
    throw new Error('Could not find coordinates for address');
}

// Reverse geocoding
async function getAddress(lat, lon) {
    // Try Google Reverse Geocoding first for consistency
    if (process.env.GOOGLE_API_KEY) {
        try {
            const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${process.env.GOOGLE_API_KEY}`;
            const { data } = await axios.get(url);
            if (data.status === 'OK' && data.results[0]) {
                console.log("✅ Google Reverse Geocoding success.");
                return data.results[0].formatted_address;
            }
        } catch (err) {
            console.error("Google Reverse Geocoding error:", err.message);
        }
    }

    // Fallback to LocationIQ
    if (!process.env.LOCATIONIQ_API_KEY) throw new Error("No reverse geocoding API keys available");
    const { data } = await axios.get(`https://us1.locationiq.com/v1/reverse.php`, {
        params: { key: process.env.LOCATIONIQ_API_KEY, lat, lon, format: 'json' }
    });
    return data?.display_name || `${lat}, ${lon}`;
}

// AQI calculation from PM2.5
function calculateAQI(pm25) {
    const breakpoints = [
        [0, 12, 0, 50], [12.1, 35.4, 51, 100], [35.5, 55.4, 101, 150],
        [55.5, 150.4, 151, 200], [150.5, 250.4, 201, 300], [250.5, 500, 301, 500]
    ];
    const bp = breakpoints.find(([low, high]) => pm25 >= low && pm25 <= high) || breakpoints[0];
    return Math.round(((bp[3] - bp[2]) / (bp[1] - bp[0])) * (pm25 - bp[0]) + bp[2]);
}

async function getAQI(lat, lon) {
    if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
        throw new Error(`Invalid coordinates: ${lat}, ${lon}`);
    }
    
    if (process.env.OPENAQ_API_KEY) {
        try {
            const locUrl = `https://api.openaq.org/v3/locations?coordinates=${lon},${lat}&radius=25000&limit=10`;
            console.log("🔍 Requesting OpenAQ locations:", locUrl);
            
            const { data: locData } = await axios.get(locUrl, {
                headers: { 'X-API-Key': process.env.OPENAQ_API_KEY }
            });
            
            console.log("📡 OpenAQ response status:", locData ? 'OK' : 'No data');
            console.log("📊 OpenAQ results found:", locData.results?.length || 0);
            
            if (locData.results?.length > 0) {
                const locationId = locData.results[0].id;
                const locationName = locData.results[0].name || 'Unknown';
                console.log(`✅ Found closest OpenAQ location: ${locationName} (ID: ${locationId})`);
                
                const measUrl = `https://api.openaq.org/v3/locations/${locationId}`;
                console.log("🔍 Requesting measurements:", measUrl);
                
                const { data: measData } = await axios.get(measUrl, {
                    headers: { 'X-API-Key': process.env.OPENAQ_API_KEY }
                });
                
                console.log("📡 Measurements response received");
                
                if (measData?.latest) {
                    let pm25 = 0, pm10 = 0;
                    console.log(`📊 Total measurements available: ${measData.latest.length}`);
                    
                    for (const m of measData.latest) {
                        const param = m.parameter?.name || m.parameter;
                        console.log(`   - ${param}: ${m.value}`);
                        if (param === 'pm25') pm25 = m.value || 0;
                        if (param === 'pm10') pm10 = m.value || 0;
                    }
                    
                    if (pm25 > 0 || pm10 > 0) {
                        const aqi = calculateAQI(pm25);
                        console.log("✅ OpenAQ data successfully fetched! PM2.5:", pm25, "PM10:", pm10, "AQI:", aqi);
                        return { aqi, pm25, pm10 };
                    } else {
                        console.log("⚠️ OpenAQ location found but no PM2.5/PM10 data available");
                    }
                } else {
                    console.log("⚠️ OpenAQ location found but no 'latest' measurements available");
                }
            } else {
                console.log("⚠️ No OpenAQ monitoring stations found within 25km radius");
            }
        } catch (err) {
            console.error('❌ OpenAQ API error:', err.response?.status, err.response?.data || err.message);
            console.log("🔄 Attempting WAQI fallback...");
        }
    } else {
        console.log("⚠️ OpenAQ API key not configured, skipping to WAQI");
    }
    
    console.log("🔄 Using WAQI fallback service...");
    if (!process.env.WAQI_API_KEY) throw new Error("All AQI services failed - no API keys");
    
    const { data } = await axios.get(`https://api.waqi.info/feed/geo:${lat};${lon}/`, {
        params: { token: process.env.WAQI_API_KEY }
    });
    
    if (data.status === 'ok') {
        const aqi = data.data.aqi || 0;
        const pm25 = data.data.iaqi?.pm25?.v || 0;
        const pm10 = data.data.iaqi?.pm10?.v || 0;
        console.log("✅ WAQI data successfully fetched:", { aqi, pm25, pm10 });
        return { aqi, pm25, pm10 };
    }
    throw new Error("All AQI services failed");
}

// CIVIC
async function getCivicComplaints(address) {
    try {
        const res = await axios.post(`${process.env.FASTAPI_URL}/predict`, { address });
        return {
            total: res.data.total_complaints,
            resolved: res.data.resolved_complaints,
            pending: res.data.pending_complaints,
            categories: res.data.categories || [{ name: "Placeholder Category", count: res.data.total_complaints }]
        };
    } catch (err) {
        console.error("Error fetching civic complaints from FastAPI:", err.message);
        // fallback to old mock data
        const mockHtml = `
            <div class="complaint">Waste not collected for 3 days.</div>
            <div class="complaint">Loud music from wedding hall at night.</div>
            <div class="complaint">Pothole on main road causing issues.</div>
            <div class="complaint">Construction noise is unbearable.</div>
        `;
        const $ = cheerio.load(mockHtml);
        const complaints = [];
        $('.complaint').each((i, el) => complaints.push($(el).text()));
        return {
            total: complaints.length,
            resolved: Math.floor(complaints.length * 0.78),
            pending: Math.ceil(complaints.length * 0.22),
            
        };
    }
}


function getOverallScore(aqi, noiseScore, complaintCount) {
    const norm = (val, max) => Math.max(0, 100 - (val / max) * 100);
    const aqiScore = norm(aqi, 200);
    const noiseScoreNorm = Math.max(0, 100 - noiseScore);
    const complaintScore = norm(complaintCount, 10);
    return Math.round((aqiScore * 0.5) + (noiseScoreNorm * 0.3) + (complaintScore * 0.2));
}

async function getAISummary(data) {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `Analyze this environmental data for a location in Delhi and provide a 2-sentence summary for a potential resident.
    - Air Quality (AQI): ${data.airQuality.aqi}
    - Estimated Noise Score (0-100): ${parseFloat(data.noiseLevel.day).toFixed(0)}
    - Recent Civic Complaints: ${data.civicComplaints.total}`;
    const result = await model.generateContent(prompt);
    return result.response.text();
}

app.post('/api/report-card', async (req, res) => {
    const { address } = req.body;
    if (!address) return res.status(400).json({ error: 'Address is required' });

    console.log(`\n🔍 Request: "${address}"`);

    try {
        let coordinates, displayLocation;
        
        // Check if input is coordinates
        const coordMatch = address.trim().match(/^(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)$/);
        
        if (coordMatch) {
            const lat = parseFloat(coordMatch[1]), lon = parseFloat(coordMatch[2]);
            if (lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180) {
                coordinates = { lat, lon };
                displayLocation = await getAddress(lat, lon);
                console.log(`📍 Coordinates: ${lat}, ${lon}`);
            } else {
                throw new Error('Invalid coordinates (lat: -90 to 90, lon: -180 to 180)');
            }
        } else {
            coordinates = await getCoordinates(address);
            displayLocation = address;
            console.log(`📍 Geocoded: ${coordinates.lat}, ${coordinates.lon}`);
        }

        // Fetch all data in parallel
        console.log("⏳ Fetching data...");
        const [airQuality, noiseData, civicData] = await Promise.all([
            getAQI(coordinates.lat, coordinates.lon),
            noiseLevel(coordinates.lat, coordinates.lon),
            getCivicComplaints(address)
        ]);

        const overallScore = getOverallScore(airQuality.aqi, parseFloat(noiseData.noiseScore), civicData.total);

        const responseData = {
            location: displayLocation,
            coordinates,
            overallScore,
            airQuality,
            noiseLevel: {
                day: parseFloat(noiseData.noiseScore),
                night: Math.max(0, parseFloat(noiseData.noiseScore) - 10)
            },
            civicComplaints: civicData
        };

        console.log("🤖 Generating AI summary...");
        responseData.aiSummary = await getAISummary(responseData);
        
        console.log("✅ Request completed!\n");
        res.json(responseData);
    } catch (error) {
        console.error("❌ Error:", error.message);
        res.status(500).json({ error: `Failed to fetch data: ${error.message}` });
    }
});

app.post('/api/chat', async (req, res) => {
    const { question, contextData } = req.body;

    if (!question || !contextData) {
        return res.status(400).json({ error: 'Question and context data are required.' });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
        You are a helpful environmental assistant named EcoBot for a specific location in Delhi.
        Your ONLY job is to answer questions based on the JSON data provided below.
        DO NOT answer any questions that are not related to this data. If the user asks something off-topic
        (like "what is the capital of France?" or "write me a poem"), you must politely decline and say
        "I can only answer questions about this environmental report."

        Here is the environmental data for the user's selected location:
        ${JSON.stringify(contextData, null, 2)}

        Now, please answer the following user question based ONLY on the data above.
        User's question: "${question}"
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        res.json({ answer: response.text() });
    } catch (error) {
        console.error("Gemini Chat API error:", error);
        res.status(500).json({ error: "Failed to get a response from the AI assistant." });
    }
});

app.post('/api/draft-complaint', async (req, res) => {
    const { userText, address } = req.body;
    if (!userText || !address) {
        return res.status(400).json({ error: "User text and address are required." });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
    You are an AI assistant helping a resident of Delhi, India, draft a formal civic complaint email.
    The user's location is: "${address}"
    The user's simple, informal description of the problem is: "${userText}"

    Your task is to convert this into a clear, formal, and respectful complaint email. The output MUST be a valid JSON object with two keys: "subject" and "body". Do not add any other text or markdown formatting like \`\`\`json.

    Example user input: "garbage not picked up on my street corner for days, it smells bad"
    Example JSON output:
    {
      "subject": "Urgent: Uncollected Garbage and Unsanitary Conditions",
      "body": "To the Municipal Sanitation Department,\\n\\nThis is to formally report an overflowing public garbage bin located at ${address}. The bin has not been cleared for several days, resulting in a significant accumulation of waste that is causing a strong, unpleasant odor and creating unsanitary conditions for local residents.\\n\\nThis situation poses a potential health hazard and requires immediate attention. I request that you dispatch a sanitation team to clear the waste and schedule more frequent collections for this location.\\n\\nThank you for your prompt action on this matter.\\n\\nSincerely,\\nA Concerned Resident"
    }
    `;

    try {
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        
        let jsonResponse;
        try {
            jsonResponse = JSON.parse(responseText.replace(/```json/g, '').replace(/```/g, '').trim());
        } catch (parseError) {
            console.error("Failed to parse Gemini response as JSON:", responseText);
            jsonResponse = {
                subject: "Civic Complaint",
                body: responseText
            };
        }

        res.json(jsonResponse);
    } catch (error) {
        console.error("Gemini Draft API error:", error);
        res.status(500).json({ error: "Failed to draft complaint." });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});



