import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon issue with Webpack
import L from 'leaflet';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});


function ComplaintMap({ complaints = [], location }) {
    // Use the location from the backend response or a default for Delhi
    const position = location ? [location.lat, location.lon] : [28.6139, 77.2090];
    const zoom = location ? 15 : 11;

    return (
        <MapContainer center={position} zoom={zoom} scrollWheelZoom={false} className="rounded-lg">
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {complaints.map((complaint, index) => (
                <Marker key={index} position={[complaint.lat, complaint.lon]}>
                    <Popup>
                        <strong>{complaint.category}:</strong> {complaint.text}
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}

export default ComplaintMap;