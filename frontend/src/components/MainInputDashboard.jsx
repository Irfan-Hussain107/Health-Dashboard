import React, { useState } from 'react';
import { MapPinIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';

const MainInputDashboard = ({ onLocationSearch, loading }) => {
    const [address, setAddress] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (address) {
            onLocationSearch(address.label);
        }
    };

    const handleGeolocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    onLocationSearch(`${latitude}, ${longitude}`);
                },
                (error) => {
                    alert('Unable to retrieve your location');
                }
            );
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="max-w-2xl w-full text-center">
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                    Uncover the Environmental Health of Your Next Neighborhood.
                </h1>
                <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-xl mx-auto leading-relaxed">
                    Get an instant "Environmental Report Card" for any address in Delhi.
                </p>

                <form onSubmit={handleSubmit} className="mb-6">
                    <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                        <div className="relative flex-1 text-left">
                            <GooglePlacesAutocomplete
                                apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
                                selectProps={{
                                    value: address,
                                    onChange: setAddress,
                                    placeholder: 'Enter an address in Delhi...',
                                    styles: {
                                        input: (provided) => ({
                                            ...provided,
                                            padding: '0.75rem 1rem',
                                            fontSize: '1.125rem',
                                            borderRadius: '0.5rem',
                                        }),
                                        option: (provided) => ({
                                            ...provided,
                                            color: '#111827',
                                        }),
                                    },
                                }}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading || !address}
                            className="px-8 py-3 bg-green-600 text-white text-lg font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            ) : (
                                <>
                                    <MagnifyingGlassIcon className="h-5 w-5" />
                                    Get Report
                                </>
                            )}
                        </button>
                    </div>
                </form>

                <div className="flex items-center justify-center gap-3 text-gray-500">
                    <div className="h-px bg-gray-300 flex-1"></div>
                    <span className="text-sm">or</span>
                    <div className="h-px bg-gray-300 flex-1"></div>
                </div>
                <button
                    onClick={handleGeolocation}
                    disabled={loading}
                    className="mt-4 text-green-600 hover:text-green-700 font-medium flex items-center gap-2 mx-auto"
                >
                    <MapPinIcon className="h-5 w-5" />
                    Use my current location
                </button>
            </div>
        </div>
    );
};

export default MainInputDashboard;