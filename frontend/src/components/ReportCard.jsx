import ScoreDisplay from './ScoreDisplay';
import Gauge from './Gauge';
import ComplaintMap from './ComplaintMap';

function ReportCard({ data }) {
    // A helper function to determine gauge color based on rating
    const getRatingColor = (rating) => {
        const lowerRating = rating.toLowerCase();
        if (['good', 'satisfactory'].includes(lowerRating)) return 'bg-green-500';
        if (['moderate', 'poor'].includes(lowerRating)) return 'bg-yellow-500';
        if (['very poor', 'severe', 'unhealthy'].includes(lowerRating)) return 'bg-red-500';
        return 'bg-gray-500';
    };

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg animate-fade-in">
            <h2 className="text-2xl font-bold mb-2">Environmental Report for:</h2>
            <p className="text-cyan-400 text-lg mb-6">{data.address}</p>

            <ScoreDisplay score={data.healthScore.grade} description={data.healthScore.description} />
            
            <div className="grid md:grid-cols-3 gap-6 my-8">
                <Gauge 
                    title="Air Quality (AQI)" 
                    value={data.aqi.value} 
                    rating={data.aqi.rating} 
                    color={getRatingColor(data.aqi.rating)}
                />
                <Gauge 
                    title="Est. Noise Level" 
                    value={data.noise.value} 
                    rating={data.noise.rating} 
                    color={getRatingColor(data.noise.rating)}
                />
                <Gauge 
                    title="Civic Issues" 
                    value={data.complaints.count} 
                    rating={`${data.complaints.count} active`} 
                    color={getRatingColor(data.complaints.rating)}
                />
            </div>

            <div>
                <h3 className="text-xl font-bold mb-4">Recent Civic Complaints Map</h3>
                <ComplaintMap complaints={data.complaints.items} location={data.location} />
            </div>
        </div>
    );
}

export default ReportCard;