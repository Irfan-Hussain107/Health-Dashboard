import React, { useState, useEffect, useCallback } from 'react';
import { MapPinIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import GooglePlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-google-places-autocomplete';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const MainInputDashboard = ({ onLocationSearch, loading, darkMode }) => {
  const [comparisonMode, setComparisonMode] = useState(false);
  
  // Location A state
  const [selectedValueA, setSelectedValueA] = useState(null);
  const [inputValueA, setInputValueA] = useState('');
  const [markerPositionA, setMarkerPositionA] = useState({ lat: 28.6139, lng: 77.2090 });
  const [centerA, setCenterA] = useState({ lat: 28.6139, lng: 77.2090 });
  const [mapA, setMapA] = useState(null);

  // Location B state (for comparison)
  const [selectedValueB, setSelectedValueB] = useState(null);
  const [inputValueB, setInputValueB] = useState('');
  const [markerPositionB, setMarkerPositionB] = useState({ lat: 28.7041, lng: 77.1025 });
  const [centerB, setCenterB] = useState({ lat: 28.7041, lng: 77.1025 });
  const [mapB, setMapB] = useState(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ['places', 'geocoding'],
  });

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

  const onLoadA = useCallback((m) => setMapA(m), []);
  const onUnmountA = useCallback(() => setMapA(null), []);
  const onLoadB = useCallback((m) => setMapB(m), []);
  const onUnmountB = useCallback(() => setMapB(null), []);

  useEffect(() => {
    if (!selectedValueA) return;
    geocodeByAddress(selectedValueA.label)
      .then(results => getLatLng(results[0]))
      .then(({ lat, lng }) => {
        const pos = { lat, lng };
        setCenterA(pos);
        setMarkerPositionA(pos);
        if (mapA) {
          mapA.panTo(pos);
          mapA.setZoom(15);
        }
      })
      .catch(err => console.error("Geocoding Error:", err));
  }, [selectedValueA, mapA]);

  useEffect(() => {
    if (!selectedValueB) return;
    geocodeByAddress(selectedValueB.label)
      .then(results => getLatLng(results[0]))
      .then(({ lat, lng }) => {
        const pos = { lat, lng };
        setCenterB(pos);
        setMarkerPositionB(pos);
        if (mapB) {
          mapB.panTo(pos);
          mapB.setZoom(15);
        }
      })
      .catch(err => console.error("Geocoding Error:", err));
  }, [selectedValueB, mapB]);

  const handleMapClickA = useCallback((e) => {
    const lat = e.latLng.lat(), lng = e.latLng.lng();
    setMarkerPositionA({ lat, lng });
    reverseGeocode(lat, lng, (address, result) => {
      setSelectedValueA({ label: address, value: result });
    });
  }, [reverseGeocode]);

  const handleMapClickB = useCallback((e) => {
    const lat = e.latLng.lat(), lng = e.latLng.lng();
    setMarkerPositionB({ lat, lng });
    reverseGeocode(lat, lng, (address, result) => {
      setSelectedValueB({ label: address, value: result });
    });
  }, [reverseGeocode]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (comparisonMode) {
      const locationA = selectedValueA?.label || inputValueA.trim();
      const locationB = selectedValueB?.label || inputValueB.trim();
      
      if (locationA && locationB) {
        onLocationSearch([locationA, locationB]);
      } else {
        alert('Please select both locations for comparison');
      }
    } else {
      const location = selectedValueA?.label || inputValueA.trim();
      if (location) {
        onLocationSearch(location);
      } else {
        alert('Please select a location or type an address');
      }
    }
  };

  const handleGeolocationA = () => {
    if (!navigator.geolocation) return alert('Geolocation not supported');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        const newPos = { lat, lng };
        setCenterA(newPos);
        setMarkerPositionA(newPos);
        if (mapA) {
          mapA.panTo(newPos);
          mapA.setZoom(15);
        }
        reverseGeocode(lat, lng, (address, result) => {
          setSelectedValueA({ label: address, value: result });
        });
      },
      (err) => {
        console.error('Geolocation error:', err);
        alert('Unable to retrieve location. Check permissions.');
      }
    );
  };

  const handleGeolocationB = () => {
    if (!navigator.geolocation) return alert('Geolocation not supported');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        const newPos = { lat, lng };
        setCenterB(newPos);
        setMarkerPositionB(newPos);
        if (mapB) {
          mapB.panTo(newPos);
          mapB.setZoom(15);
        }
        reverseGeocode(lat, lng, (address, result) => {
          setSelectedValueB({ label: address, value: result });
        });
      },
      (err) => {
        console.error('Geolocation error:', err);
        alert('Unable to retrieve location. Check permissions.');
      }
    );
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading Map...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Toggle Section */}
      <div className={`py-6 ${darkMode ? 'bg-[#2E2B2B]' : 'bg-gradient-to-br from-green-50 to-blue-50'}`}>
        <div className="max-w-md mx-auto px-4">
          <div className="flex items-center justify-center gap-4">
            <span className={`font-medium ${!comparisonMode ? 'text-green-600' : darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Single Location
            </span>
            <button
              onClick={() => setComparisonMode(!comparisonMode)}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                comparisonMode ? 'bg-green-600' : darkMode ? 'bg-gray-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  comparisonMode ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`font-medium ${comparisonMode ? 'text-green-600' : darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Compare Locations
            </span>
          </div>
        </div>
      </div>

      {!comparisonMode ? (
        // Single Location Mode
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className={`flex items-center justify-center p-8 ${darkMode ? 'bg-[#2E2B2B]' : 'bg-gradient-to-br from-green-50 to-blue-50'}`}>
            <div className="max-w-md w-full text-center lg:text-left">
              <h1 className={`text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Uncover Your Neighborhood's Health.
              </h1>
              <p className={`text-lg mb-8 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Type an address, click on the map, or use your current location.
              </p>

              <form onSubmit={handleSubmit} className="mb-6">
                <div className="relative text-left mb-3">
                  <GooglePlacesAutocomplete
                    apiOptions={{ region: 'in' }}
                    selectProps={{
                      value: selectedValueA,
                      onChange: (sel) => {
                        setSelectedValueA(sel);
                        if (sel) setTimeout(() => setInputValueA(sel.label), 0);
                      },
                      isClearable: true,
                      placeholder: 'Type address, click map, or use location...',
                      styles: {
                        control: (provided) => ({
                          ...provided,
                          minHeight: '48px',
                          backgroundColor: darkMode ? '#1f1f1f' : '#fff',
                          borderColor: darkMode ? '#444' : '#ccc',
                        }),
                        input: (provided) => ({
                          ...provided,
                          color: darkMode ? '#fff' : '#000',
                        }),
                        singleValue: (provided) => ({
                          ...provided,
                          color: selectedValueA ? (darkMode ? '#fff' : '#000') : (darkMode ? '#aaa' : '#666'),
                        }),
                        placeholder: (provided) => ({
                          ...provided,
                          color: darkMode ? '#aaa' : '#666',
                        }),
                        menu: (provided) => ({
                          ...provided,
                          backgroundColor: darkMode ? '#333' : '#fff',
                        }),
                        option: (provided, state) => ({
                          ...provided,
                          backgroundColor: state.isFocused
                            ? darkMode ? '#444' : '#f0f0f0'
                            : darkMode ? '#1f1f1f' : '#fff',
                          color: darkMode ? '#fff' : '#000',
                        }),
                      },
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || (!selectedValueA && !inputValueA.trim())}
                  className={`w-full px-8 py-3 font-semibold rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed 
                    ${darkMode ? 'bg-[#4A4848] text-white hover:bg-gray-700' : 'bg-green-600 text-white hover:bg-green-700'}`}
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
                onClick={handleGeolocationA}
                disabled={loading}
                className={`mt-4 font-medium flex items-center gap-2 mx-auto lg:mx-0 disabled:opacity-50 disabled:cursor-not-allowed transition-all
                  ${darkMode ? 'text-green-400 hover:text-green-300' : 'text-green-600 hover:text-green-700'}`}
              >
                <MapPinIcon className="h-5 w-5" />
                Use my current location
              </button>

              <p className={`mt-6 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                💡 Tip: Click anywhere on the map to select that location
              </p>
            </div>
          </div>

          <div className={`h-96 lg:h-full p-4 lg:p-8 flex items-center justify-center relative ${darkMode ? 'bg-[#2E2B2B]' : 'bg-gradient-to-br from-green-50 to-blue-50'}`}>
            <div className="w-full h-full bg-white dark:bg-gray-900 rounded-2xl shadow-lg border overflow-hidden relative">
              <GoogleMap
                mapContainerStyle={{ width: '100%', height: '100%' }}
                center={centerA}
                zoom={11}
                onLoad={onLoadA}
                onUnmount={onUnmountA}
                onClick={handleMapClickA}
                options={{
                  gestureHandling: 'greedy',
                  disableDefaultUI: true,
                  zoomControl: true,
                  mapTypeControl: false,
                  streetViewControl: false,
                  fullscreenControl: false
                }}
              >
                <Marker position={markerPositionA} animation={window.google?.maps?.Animation?.DROP} />
              </GoogleMap>

              <button
                onClick={handleGeolocationA}
                disabled={loading}
                className={`absolute bottom-6 right-6 p-3 rounded-full shadow-lg border z-10 transition-all disabled:opacity-50 disabled:cursor-not-allowed
                  ${darkMode ? 'bg-gray-800 text-white hover:bg-gray-700 border-gray-600' : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200'}`}
                title="Use my current location"
              >
                <MapPinIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        // Comparison Mode - Two Locations Side by Side
        <div className={`${darkMode ? 'bg-[#2E2B2B]' : 'bg-gradient-to-br from-green-50 to-blue-50'}`}>
          <div className="max-w-7xl mx-auto p-8">
            <h1 className={`text-3xl font-bold mb-8 text-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Compare Two Locations
            </h1>

            <form onSubmit={handleSubmit} className="mb-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Location A */}
                <div className="space-y-4">
                  <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Location A
                  </h3>
                  <GooglePlacesAutocomplete
                    apiOptions={{ region: 'in' }}
                    selectProps={{
                      value: selectedValueA,
                      onChange: (sel) => {
                        setSelectedValueA(sel);
                        if (sel) setTimeout(() => setInputValueA(sel.label), 0);
                      },
                      isClearable: true,
                      placeholder: 'Enter first location...',
                      styles: {
                        control: (provided) => ({
                          ...provided,
                          minHeight: '48px',
                          backgroundColor: darkMode ? '#1f1f1f' : '#fff',
                          borderColor: darkMode ? '#444' : '#ccc',
                        }),
                        input: (provided) => ({
                          ...provided,
                          color: darkMode ? '#fff' : '#000',
                        }),
                        singleValue: (provided) => ({
                          ...provided,
                          color: selectedValueA ? (darkMode ? '#fff' : '#000') : (darkMode ? '#aaa' : '#666'),
                        }),
                        placeholder: (provided) => ({
                          ...provided,
                          color: darkMode ? '#aaa' : '#666',
                        }),
                        menu: (provided) => ({
                          ...provided,
                          backgroundColor: darkMode ? '#333' : '#fff',
                        }),
                        option: (provided, state) => ({
                          ...provided,
                          backgroundColor: state.isFocused
                            ? darkMode ? '#444' : '#f0f0f0'
                            : darkMode ? '#1f1f1f' : '#fff',
                          color: darkMode ? '#fff' : '#000',
                        }),
                      },
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleGeolocationA}
                    disabled={loading}
                    className={`font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all
                      ${darkMode ? 'text-green-400 hover:text-green-300' : 'text-green-600 hover:text-green-700'}`}
                  >
                    <MapPinIcon className="h-5 w-5" />
                    Use current location
                  </button>

                  <div className="w-full h-80 bg-white dark:bg-gray-900 rounded-xl shadow-lg border overflow-hidden relative">
                    <GoogleMap
                      mapContainerStyle={{ width: '100%', height: '100%' }}
                      center={centerA}
                      zoom={11}
                      onLoad={onLoadA}
                      onUnmount={onUnmountA}
                      onClick={handleMapClickA}
                      options={{
                        gestureHandling: 'greedy',
                        disableDefaultUI: true,
                        zoomControl: true,
                        mapTypeControl: false,
                        streetViewControl: false,
                        fullscreenControl: false
                      }}
                    >
                      <Marker position={markerPositionA} animation={window.google?.maps?.Animation?.DROP} />
                    </GoogleMap>
                  </div>
                </div>

                {/* Location B */}
                <div className="space-y-4">
                  <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Location B
                  </h3>
                  <GooglePlacesAutocomplete
                    apiOptions={{ region: 'in' }}
                    selectProps={{
                      value: selectedValueB,
                      onChange: (sel) => {
                        setSelectedValueB(sel);
                        if (sel) setTimeout(() => setInputValueB(sel.label), 0);
                      },
                      isClearable: true,
                      placeholder: 'Enter second location...',
                      styles: {
                        control: (provided) => ({
                          ...provided,
                          minHeight: '48px',
                          backgroundColor: darkMode ? '#1f1f1f' : '#fff',
                          borderColor: darkMode ? '#444' : '#ccc',
                        }),
                        input: (provided) => ({
                          ...provided,
                          color: darkMode ? '#fff' : '#000',
                        }),
                        singleValue: (provided) => ({
                          ...provided,
                          color: selectedValueB ? (darkMode ? '#fff' : '#000') : (darkMode ? '#aaa' : '#666'),
                        }),
                        placeholder: (provided) => ({
                          ...provided,
                          color: darkMode ? '#aaa' : '#666',
                        }),
                        menu: (provided) => ({
                          ...provided,
                          backgroundColor: darkMode ? '#333' : '#fff',
                        }),
                        option: (provided, state) => ({
                          ...provided,
                          backgroundColor: state.isFocused
                            ? darkMode ? '#444' : '#f0f0f0'
                            : darkMode ? '#1f1f1f' : '#fff',
                          color: darkMode ? '#fff' : '#000',
                        }),
                      },
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleGeolocationB}
                    disabled={loading}
                    className={`font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all
                      ${darkMode ? 'text-green-400 hover:text-green-300' : 'text-green-600 hover:text-green-700'}`}
                  >
                    <MapPinIcon className="h-5 w-5" />
                    Use current location
                  </button>

                  <div className="w-full h-80 bg-white dark:bg-gray-900 rounded-xl shadow-lg border overflow-hidden relative">
                    <GoogleMap
                      mapContainerStyle={{ width: '100%', height: '100%' }}
                      center={centerB}
                      zoom={11}
                      onLoad={onLoadB}
                      onUnmount={onUnmountB}
                      onClick={handleMapClickB}
                      options={{
                        gestureHandling: 'greedy',
                        disableDefaultUI: true,
                        zoomControl: true,
                        mapTypeControl: false,
                        streetViewControl: false,
                        fullscreenControl: false
                      }}
                    >
                      <Marker position={markerPositionB} animation={window.google?.maps?.Animation?.DROP} />
                    </GoogleMap>
                  </div>
                </div>
              </div>

              <div className="mt-8 text-center">
                <button
                  type="submit"
                  disabled={loading || (!selectedValueA && !inputValueA.trim()) || (!selectedValueB && !inputValueB.trim())}
                  className={`px-12 py-4 font-semibold rounded-lg inline-flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed 
                    ${darkMode ? 'bg-[#4A4848] text-white hover:bg-gray-700' : 'bg-green-600 text-white hover:bg-green-700'}`}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                      <span>Comparing...</span>
                    </>
                  ) : (
                    <>
                      <MagnifyingGlassIcon className="h-5 w-5" />
                      Compare Locations
                    </>
                  )}
                </button>
              </div>
            </form>

            <p className={`text-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              💡 Tip: Click on either map to select locations visually
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainInputDashboard;