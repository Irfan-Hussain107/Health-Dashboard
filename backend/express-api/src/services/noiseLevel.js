import axios from 'axios';
import { getDistance, findNearest } from 'geolib';

/**
 * SOURCE dB LEVELS at 10m reference distance
 * Sources: WHO, EPA, FHWA, FAA, FRA
 * https://www.who.int/publications/i/item/9789289053563
 * https://www.fhwa.dot.gov/environment/noise/traffic_noise_model/
 * https://www.faa.gov/airports/resources/advisory_circulars/
 */
const SOURCE_DB_LEVELS = {
    // Aviation (FAA AC 150/5020-1)
    'aeroway_aerodrome': 90, 'aeroway_runway': 95,
    'aeroway_helipad': 88, 'aeroway_terminal': 85,
    
    // Highways (FHWA-PD-96-046)
    'highway_motorway': 82, 'highway_trunk': 80,
    'highway_primary': 75, 'highway_secondary': 70,
    
    // Railways (DOT/FRA/ORD-12/15)
    'railway_rail': 85, 'railway_subway': 82,
    'railway_tram': 75, 'railway_light_rail': 78,
    
    // Industrial/Commercial (EPA 1971)
    'landuse_industrial': 70, 'landuse_commercial': 65,
    'landuse_retail': 63, 'landuse_construction': 75,
    
    // Transport Facilities
    'amenity_bus_station': 72, 'amenity_parking': 60,
    'amenity_fuel': 65, 'public_transport_station': 70,
    'public_transport_stop_position': 65,
    
    // Entertainment & Events
    'leisure_stadium': 75, 'leisure_sports_centre': 68,
    'amenity_convention_centre': 68, 'amenity_events_venue': 70,
    
    // Hospitality
    'amenity_nightclub': 70, 'amenity_bar': 65,
    'amenity_pub': 63, 'amenity_restaurant': 60,
    'amenity_cafe': 55, 'amenity_fast_food': 58,
    
    // Cultural & Recreation
    'amenity_theatre': 60, 'amenity_cinema': 55,
    'amenity_community_centre': 58, 'leisure_park': 50,
    'leisure_playground': 62,
    
    // Education (WHO Schools Guide)
    'amenity_school': 60, 'amenity_college': 58,
    'amenity_university': 58, 'amenity_kindergarten': 58,
    
    // Religious & Civic
    'amenity_place_of_worship': 50, 'amenity_townhall': 55,
    'amenity_library': 45,
};

/**
 * ACTIVITY MODIFIERS - Fraction of time source is active
 * Used for Equivalent Continuous Sound Level (Leq) calculation
 * Reference: ISO 1996-1:2016
 */
const ACTIVITY_MODIFIERS = {
    // 24/7 Continuous
    'highway_motorway': 1.0, 'highway_trunk': 1.0,
    'highway_primary': 0.95, 'highway_secondary': 0.85,
    
    // Frequent (reduced at night)
    'railway_rail': 0.9, 'railway_subway': 0.85,
    'railway_tram': 0.8, 'railway_light_rail': 0.8,
    'landuse_industrial': 0.85, 'landuse_construction': 0.5,
    
    // Business hours
    'landuse_commercial': 0.6, 'landuse_retail': 0.65,
    'amenity_bus_station': 0.75, 'public_transport_station': 0.75,
    'amenity_parking': 0.7, 'amenity_fuel': 0.8,
    
    // Aviation
    'aeroway_aerodrome': 0.7, 'aeroway_runway': 0.7,
    'aeroway_helipad': 0.5, 'aeroway_terminal': 0.65,
    
    // Daytime only
    'amenity_school': 0.4, 'amenity_college': 0.45,
    'amenity_university': 0.45, 'amenity_kindergarten': 0.35,
    'leisure_playground': 0.4, 'leisure_park': 0.5,
    'amenity_library': 0.5,
    
    // Evening/Night
    'amenity_nightclub': 0.4, 'amenity_bar': 0.5,
    'amenity_pub': 0.5, 'amenity_restaurant': 0.6,
    'amenity_cafe': 0.55, 'amenity_theatre': 0.3,
    'amenity_cinema': 0.4,
    
    // Event-based
    'leisure_stadium': 0.3, 'leisure_sports_centre': 0.45,
    'amenity_convention_centre': 0.35, 'amenity_events_venue': 0.35,
    'amenity_community_centre': 0.4,
    
    // Occasional
    'amenity_place_of_worship': 0.25, 'amenity_townhall': 0.4,
    'amenity_fast_food': 0.65, 'public_transport_stop_position': 0.7,
};

/**
 * Calculate SPL using Inverse Square Law + Atmospheric Absorption
 * Formula: SPL(d) = SPL(ref) - 20*log10(d/d_ref) - α*(d-d_ref)
 * 
 * Reference: ISO 9613-2 (Outdoor sound propagation)
 * https://www.iso.org/standard/20649.html
 */
function calculateSPL(sourceDB, distance) {
    if (distance < 1) distance = 1;
    
    // Inverse square law: -6dB per doubling of distance
    const distanceAttenuation = 20 * Math.log10(distance / 10);
    
    // Atmospheric absorption: ~0.005 dB/m for mid-frequencies
    const atmosphericAbsorption = 0.005 * (distance - 10);
    
    return sourceDB - distanceAttenuation - atmosphericAbsorption;
}

/**
 * Apply activity modifier (temporal averaging)
 * Formula: dB_eff = dB + 10*log10(activity)
 * 
 * Reference: ISO 1996-1:2016 (Leq calculation)
 * https://www.iso.org/standard/59765.html
 */
function applyActivity(db, activity) {
    return activity >= 1 ? db : Math.max(0, db + 10 * Math.log10(activity));
}

/**
 * Combine noise levels logarithmically
 * Formula: L_total = 10*log10(Σ 10^(L_i/10))
 * 
 * Reference: ANSI S1.4-1983 (Sound Level Meters)
 */
function combineNoise(dbLevels) {
    if (dbLevels.length === 0) return 0;
    const sum = dbLevels.reduce((s, db) => s + Math.pow(10, db / 10), 0);
    return 10 * Math.log10(sum);
}

/**
 * Barrier attenuation based on distance (simplified urban model)
 * Reference: ISO 9613-2 Section 7 (Screening)
 * Maekawa's diffraction model (simplified)
 */
function barrierAttenuation(distance) {
    if (distance < 50) return 0;
    if (distance < 150) return 3;
    if (distance < 400) return 5;
    if (distance < 700) return 8;
    return 12;
}

/**
 * Normalize to WHO-based score (0-100)
 * Reference: WHO Environmental Noise Guidelines 2018
 * https://www.who.int/europe/publications/i/item/9789289053563
 */
function normalizeScore(totalDB) {
    let score, category, description, healthImpact;
    
    if (totalDB <= 30) {
        score = (totalDB / 30) * 20;
        category = 'Excellent';
        description = 'Very quiet, ideal for rest';
        healthImpact = 'No negative health impact';
    } else if (totalDB <= 45) {
        score = 20 + ((totalDB - 30) / 15) * 20;
        category = 'Good';
        description = 'Quiet residential area';
        healthImpact = 'Minimal health impact';
    } else if (totalDB <= 55) {
        score = 40 + ((totalDB - 45) / 10) * 20;
        category = 'Moderate';
        description = 'Typical urban residential';
        healthImpact = 'Some sleep disturbance possible';
    } else if (totalDB <= 65) {
        score = 60 + ((totalDB - 55) / 10) * 20;
        category = 'Poor';
        description = 'Noisy urban area';
        healthImpact = 'Sleep disturbance, stress';
    } else if (totalDB <= 75) {
        score = 80 + ((totalDB - 65) / 10) * 15;
        category = 'Very Poor';
        description = 'Very noisy, significant disturbance';
        healthImpact = 'Health risk: hypertension, sleep disorders';
    } else {
        score = 95 + Math.min((totalDB - 75) / 10 * 5, 5);
        category = 'Hazardous';
        description = 'Extremely noisy, unacceptable';
        healthImpact = 'Serious health risk: hearing damage';
    }
    
    return {
        score: Math.min(Math.round(score), 100),
        category,
        description,
        healthImpact,
        actualDB: Math.round(totalDB * 10) / 10,
    };
}

function getSourceKey(tags) {
    if (!tags) return null;
    if (tags.aeroway) return `aeroway_${tags.aeroway}`;
    if (tags.railway) return `railway_${tags.railway}`;
    if (tags.highway) return `highway_${tags.highway}`;
    if (tags.landuse) return `landuse_${tags.landuse}`;
    if (tags.public_transport) return `public_transport_${tags.public_transport}`;
    if (tags.leisure) return `leisure_${tags.leisure}`;
    if (tags.amenity) return `amenity_${tags.amenity}`;
    return null;
}

function calcDistance(sourceCoords, element) {
    if (element.type === 'node') {
        return getDistance(sourceCoords, {
            latitude: element.lat,
            longitude: element.lon
        });
    } else if (element.type === 'way' && element.geometry?.length > 0) {
        const nearest = findNearest(sourceCoords, element.geometry);
        return getDistance(sourceCoords, nearest);
    }
    return Infinity;
}

/**
 * Main noise calculation function
 */
async function noiseLevel(lat, lon, radius = 1000) {
    if (isNaN(lat) || isNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
        throw new Error('Invalid coordinates');
    }
    
    const sourceCoords = { latitude: lat, longitude: lon };
    
    const query = `
        [out:json][timeout:120];
        (
            way["aeroway"~"aerodrome|runway|helipad|terminal"](around:${radius},${lat},${lon});
            node["aeroway"~"aerodrome|runway|helipad|terminal"](around:${radius},${lat},${lon});
            way["highway"~"motorway|trunk|primary|secondary"](around:${radius},${lat},${lon});
            way["railway"~"rail|subway|tram|light_rail"](around:${radius},${lat},${lon});
            way["landuse"~"industrial|commercial|retail|construction"](around:${radius},${lat},${lon});
            node["amenity"~"bus_station|parking|fuel"](around:${radius},${lat},${lon});
            way["amenity"~"bus_station|parking|fuel"](around:${radius},${lat},${lon});
            node["public_transport"~"station|stop_position"](around:${radius},${lat},${lon});
            way["leisure"~"stadium|sports_centre"](around:${radius},${lat},${lon});
            node["leisure"~"stadium|sports_centre"](around:${radius},${lat},${lon});
            node["amenity"~"convention_centre|events_venue|nightclub|bar|pub|restaurant|cafe|fast_food|theatre|cinema|community_centre|school|college|university|kindergarten|library|townhall|place_of_worship"](around:${radius},${lat},${lon});
            way["amenity"~"convention_centre|events_venue|nightclub|bar|pub|restaurant|cafe|fast_food|theatre|cinema|community_centre|school|college|university|kindergarten|library|townhall|place_of_worship"](around:${radius},${lat},${lon});
            way["leisure"~"park|playground"](around:${radius},${lat},${lon});
            node["leisure"~"park|playground"](around:${radius},${lat},${lon});
        );
        out geom;
    `;
    
    try {
        console.log(`\n🔍 Analyzing noise within ${radius}m of (${lat}, ${lon})...`);
        
        const res = await axios.post(
            'https://overpass-api.de/api/interpreter',
            `data=${encodeURIComponent(query)}`,
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );
        
        const sources = res.data.elements;
        console.log(`✅ Found ${sources.length} potential sources\n`);
        
        if (sources.length === 0) {
            return {
                noiseScore: 10,
                category: 'Excellent',
                description: 'Very quiet area',
                healthImpact: 'No negative health impact',
                actualDB: 25,
                sources: [],
                dominantSources: [],
                metadata: { location: { lat, lon }, radius, sourcesAnalyzed: 0 }
            };
        }
        
        const processed = [];
        const dbContributions = [];
        const byCategory = { 'High Impact': [], 'Medium Impact': [], 'Low Impact': [] };
        
        for (const src of sources) {
            const key = getSourceKey(src.tags);
            if (!key || !SOURCE_DB_LEVELS[key]) continue;
            
            const dist = calcDistance(sourceCoords, src);
            if (dist === Infinity || dist > radius) continue;
            
            const baseDB = SOURCE_DB_LEVELS[key];
            const activity = ACTIVITY_MODIFIERS[key] || 0.5;
            
            // Physics calculations
            const dbAtDist = calculateSPL(baseDB, dist);
            const effective = applyActivity(dbAtDist, activity);
            const barrier = barrierAttenuation(dist);
            const finalDB = Math.max(0, effective - barrier);
            
            if (finalDB > 25) {
                dbContributions.push(finalDB);
                
                const impact = baseDB >= 75 ? 'High Impact' 
                    : baseDB >= 60 ? 'Medium Impact' : 'Low Impact';
                
                const info = {
                    id: src.id,
                    name: src.tags?.name || 'Unnamed',
                    type: key,
                    distance: Math.round(dist),
                    baseDB,
                    dbAtLocation: Math.round(finalDB * 10) / 10,
                    activityFactor: activity,
                    impact,
                };
                
                processed.push(info);
                byCategory[impact].push(info);
            }
        }
        
        const totalDB = dbContributions.length > 0 ? combineNoise(dbContributions) : 25;
        const result = normalizeScore(totalDB);
        
        const dominant = processed
            .sort((a, b) => b.dbAtLocation - a.dbAtLocation)
            .slice(0, 5)
            .map(s => ({
                name: s.name,
                type: s.type,
                distance: s.distance,
                contribution: s.dbAtLocation,
            }));
        
        console.log(`\n📊 RESULTS:`);
        console.log(`   Total: ${result.actualDB} dB`);
        console.log(`   Score: ${result.score}/100 (${result.category})`);
        console.log(`   Sources: ${processed.length}\n`);
        
        return {
            noiseScore: result.score,
            category: result.category,
            description: result.description,
            healthImpact: result.healthImpact,
            actualDB: result.actualDB,
            sources: processed,
            sourcesByCategory: byCategory,
            dominantSources: dominant,
            metadata: {
                location: { lat, lon },
                radius,
                sourcesAnalyzed: processed.length,
                totalSourcesFound: sources.length,
            }
        };
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        throw new Error('Failed to fetch noise data: ' + error.message);
    }
}

export default noiseLevel;