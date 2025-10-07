import axios from 'axios';
import { getDistance, findNearest } from 'geolib';

async function noiseLevel(lat, lon){
    const radiusInMeters = 1000;

    if (isNaN(lat) || isNaN(lon)) {
        throw new Error('Invalid or missing latitude/longitude parameters.');
    }

    const sourceCoordinates = { latitude: lat, longitude: lon };
    
    const query = `
        [out:json][timeout:120];
        (
        // High impact sources
        way["aeroway"~"aerodrome|runway"](around:${radiusInMeters},${lat},${lon});
        way["highway"~"primary|trunk"](around:${radiusInMeters},${lat},${lon});
        way["railway"="rail"](around:${radiusInMeters},${lat},${lon});
        
        // Medium impact sources  
        way["landuse"~"industrial|commercial"](around:${radiusInMeters},${lat},${lon});
        way["amenity"~"bus_station|convention_centre"](around:${radiusInMeters},${lat},${lon});
        way["leisure"="stadium"](around:${radiusInMeters},${lat},${lon});
        node["public_transport"="station"](around:${radiusInMeters},${lat},${lon});
        
        // Low impact sources
        node["amenity"~"bar|pub|nightclub|theatre|cinema"](around:${radiusInMeters},${lat},${lon});
        way["amenity"~"school|university"](around:${radiusInMeters},${lat},${lon});
        way["amenity"="place_of_worship"](around:${radiusInMeters},${lat},${lon});
        );
        out geom;
    `;

    const overpassApiUrl = 'https://overpass-api.de/api/interpreter';

    try {
        console.log("Sending query to Overpass API...");
        const response = await axios.post(overpassApiUrl, `data=${encodeURIComponent(query)}`, {
            headers: { "Content-Type": 'application/x-www-form-urlencoded' }
        });

        const noiseSources = response.data.elements;
        console.log(`Success! Found ${noiseSources.length} total noise sources to process.\n`);

        const maxPressureScores = {};

        const processedSources = noiseSources.reduce((accumulator, source) => {
            const tags = source.tags || {};
            let sourceTypeKey = '';

            if (tags.highway) sourceTypeKey = `highway_${tags.highway}`;
            else if (tags.railway) sourceTypeKey = `railway_${tags.railway}`;
            else if (tags.aeroway) sourceTypeKey = `aeroway_${tags.aeroway}`;
            else if (tags.landuse) sourceTypeKey = `landuse_${tags.landuse}`;
            else if (tags.amenity) sourceTypeKey = `amenity_${tags.amenity}`;
            else if (tags.leisure) sourceTypeKey = `leisure_${tags.leisure}`;
            else if (tags.public_transport) sourceTypeKey = `transport_${tags.public_transport}`;

            if (!sourceTypeKey) {
                return accumulator;
            }

            let distanceInMeters = 0;
            if (source.type === 'node') {
                distanceInMeters = getDistance(sourceCoordinates, { latitude: source.lat, longitude: source.lon });
            } else if (source.type === 'way' && source.geometry) {
                const nearestPoint = findNearest(sourceCoordinates, source.geometry);
                distanceInMeters = getDistance(sourceCoordinates, nearestPoint);
            }

            let baseWeight = 0.0;
            let impactLevel = 'UNKNOWN';
            if (tags.aeroway || (tags.highway && ['primary', 'trunk'].includes(tags.highway)) || tags.railway) {
                baseWeight = 1.0; impactLevel = 'HIGH';
            } else if (tags.landuse || (tags.amenity && ['bus_station', 'convention_centre'].includes(tags.amenity)) || tags.leisure || tags.public_transport) {
                baseWeight = 0.6; impactLevel = 'MEDIUM';
            } else if (tags.amenity) {
                baseWeight = 0.3; impactLevel = 'LOW';
            }
            
            const pressureScore = baseWeight / (distanceInMeters + 10);
            maxPressureScores[sourceTypeKey] = Math.max(maxPressureScores[sourceTypeKey] || 0, pressureScore);
            
            
            accumulator.push({
                id: source.id,
                name: tags.name || "Unnamed",
                type: sourceTypeKey,
                distance: Math.round(distanceInMeters),
                impact: impactLevel
            });

            return accumulator;

        }, []); // Start with an empty array as our initial accumulator

        const totalRawScore = Object.values(maxPressureScores).reduce((sum, current) => sum + current, 0);
        console.log(totalRawScore)
        const maximumExpectedScore = 0.05;
        const normalizedScore = (totalRawScore / maximumExpectedScore) * 100;
        const finalScore = Math.min(normalizedScore, 100);

        console.log(maxPressureScores)

        return {
            noiseScore: finalScore.toFixed(2),
            sources: processedSources,
            dominantSources: maxPressureScores,
            rawScore: totalRawScore.toFixed(4)
        }
    }catch(error) {
        console.error("Error fetching data from Overpass API:", error.message);
        throw new Error('Failed to fetch or process noise data.')
    }    
}

export default noiseLevel