import React, { useState, useEffect, useCallback } from 'react';
import { MapPinIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import GooglePlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-google-places-autocomplete';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const MainInputDashboard = ({ onLocationSearch, loading }) => {
    const [selectedValue, setSelectedValue] = useState(null);
    const [inputValue, setInputValue] = useState('');
    const [markerPosition, setMarkerPosition] = useState({ lat: 28.6139, lng: 77.2090 });
    const [center, setCenter] = useState({ lat: 28.6139, lng: 77.2090 });
    const [map, setMap] = useState(null);

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries: ['places', 'geocoding'],
    });

    // Reverse geocode coordinates to address
    const reverseGeocode = useCallback((lat, lng, callback) => {
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
            if (status === 'OK' && results[0]) {
                callback(results[0].formatted_address, results[0]);
            } else {
                console.error('Geocoding failed:', status);
            }
        });
    }, []);

    const onLoad = useCallback((m) => setMap(m), []);
    const onUnmount = useCallback(() => setMap(null), []);

    // Update map when location selected from dropdown
    useEffect(() => {
        if (!selectedValue) return;
        geocodeByAddress(selectedValue.label)
            .then(results => getLatLng(results[0]))
            .then(({ lat, lng }) => {
                const pos = { lat, lng };
                setCenter(pos);
                setMarkerPosition(pos);
                if (map) {
                    map.panTo(pos);
                    map.setZoom(15);
                }
            })
            .catch(err => console.error("Geocoding Error:", err));
    }, [selectedValue, map]);

    // Handle map click
    const handleMapClick = useCallback((e) => {
        const lat = e.latLng.lat(), lng = e.latLng.lng();
        setMarkerPosition({ lat, lng });
        reverseGeocode(lat, lng, (address, result) => {
            setSelectedValue({ label: address, value: result });
        });
    }, [reverseGeocode]);

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        const location = selectedValue?.label || inputValue.trim();
        if (location) {
            onLocationSearch(location);
        } else {
            alert('Please select a location or type an address');
        }
    };
    
    // Get user's current location
    const handleGeolocation = () => {
        if (!navigator.geolocation) return alert('Geolocation not supported');
        
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude: lat, longitude: lng } = pos.coords;
                const newPos = { lat, lng };
                setCenter(newPos);
                setMarkerPosition(newPos);
                if (map) {
                    map.panTo(newPos);
                    map.setZoom(15);
                }
                
                reverseGeocode(lat, lng, (address, result) => {
                    setSelectedValue({ label: address, value: result });
                });
                onLocationSearch(`${lat}, ${lng}`);
            },
            (err) => {
                console.error('Geolocation error:', err);
                alert('Unable to retrieve location. Check permissions.');
            }
        );
    };

    if (!isLoaded) return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-xl">Loading Map...</div>
        </div>
    );

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
            <div className="flex items-center justify-center p-8 bg-gradient-to-br from-green-50 to-blue-50">
                <div className="max-w-md w-full text-center lg:text-left">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Uncover Your Neighborhood's Health.
                    </h1>
                    <p className="text-lg text-gray-600 mb-8">
                        Type an address, click on the map, or use your current location.
                    </p>

                    <form onSubmit={handleSubmit} className="mb-6">
                        <div className="relative text-left mb-3">
                            <GooglePlacesAutocomplete
                                apiOptions={{ region: 'in' }}
                                selectProps={{
                                    value: selectedValue,
                                    onChange: (sel) => {
                                        setSelectedValue(sel);
                                        if (sel) setTimeout(() => setInputValue(sel.label), 0);
                                    },
                                    isClearable: true,
                                    placeholder: 'Type address, click map, or use location...',
                                    styles: { 
                                        input: (p) => ({ ...p, padding: '0.75rem 1rem' }),
                                        control: (p) => ({ ...p, minHeight: '48px' })
                                    }
                                }}
                            />
                        </div>
                        
                        <button 
                            type="submit" 
                            disabled={loading || (!selectedValue && !inputValue.trim())} 
                            className="w-full px-8 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                                    <span>Analyzing...</span>
                                </>
                            ) : (
                                <>
                                    <MagnifyingGlassIcon className="h-5 w-5" /> 
                                    Get Report
                                </>
                            )}
                        </button>
                    </form>

                    <button 
                        onClick={handleGeolocation} 
                        disabled={loading} 
                        className="mt-4 text-green-600 hover:text-green-700 font-medium flex items-center gap-2 mx-auto lg:mx-0 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        <MapPinIcon className="h-5 w-5" /> 
                        Use my current location
                    </button>
                    
                    <p className="mt-6 text-sm text-gray-500">
                        💡 Tip: Click anywhere on the map to select that location
                    </p>
                </div>
            </div>
            
            <div className="h-96 lg:h-full bg-gradient-to-br from-green-50 to-blue-50 p-4 lg:p-8 flex items-center justify-center relative">
                <div className="w-full h-full bg-white rounded-2xl shadow-lg border overflow-hidden relative">
                    <GoogleMap
                        mapContainerStyle={{ width: '100%', height: '100%' }}
                        center={center}
                        zoom={11}
                        onLoad={onLoad}
                        onUnmount={onUnmount}
                        onClick={handleMapClick}
                        options={{ 
                            gestureHandling: 'greedy',
                            disableDefaultUI: true,
                            zoomControl: true,
                            mapTypeControl: false,
                            streetViewControl: false,
                            fullscreenControl: false
                        }}
                    >
                        <Marker 
                            position={markerPosition}
                            animation={window.google?.maps?.Animation?.DROP}
                        />
                    </GoogleMap>
                    
                    <button
                        onClick={handleGeolocation}
                        disabled={loading}
                        className="absolute bottom-6 right-6 bg-white hover:bg-gray-50 text-gray-700 p-3 rounded-full shadow-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all z-10"
                        title="Use my current location"
                    >
                        <MapPinIcon className="h-6 w-6" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MainInputDashboard;