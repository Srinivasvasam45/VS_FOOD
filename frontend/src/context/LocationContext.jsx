import React, { createContext, useContext, useState, useEffect } from 'react';

const LocationContext = createContext(null);

export const LocationProvider = ({ children }) => {
  const [coords, setCoords] = useState(() => {
    const saved = localStorage.getItem('user_coords');
    return saved ? JSON.parse(saved) : null;
  });
  const [locationName, setLocationName] = useState(() => {
    return localStorage.getItem('user_location_name') || 'Current Location';
  });
  const [isLocating, setIsLocating] = useState(false);
  const [locationDenied, setLocationDenied] = useState(false);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocationDenied(true);
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userCoordinates = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setCoords(userCoordinates);
        setLocationName('Hyderabad, IN');
        setLocationDenied(false);
        setIsLocating(false);
        localStorage.setItem('user_coords', JSON.stringify(userCoordinates));
        localStorage.setItem('user_location_name', 'Hyderabad, IN');
      },
      (error) => {
        console.warn('Geolocation access denied or unavailable:', error.message);
        setLocationDenied(true);
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  useEffect(() => {
    // Attempt to prompt or load saved coordinates
    if (!coords && !locationDenied) {
      requestLocation();
    }
  }, []);

  const setManualLocation = (lat, lng, name) => {
    const newCoords = { lat: Number(lat), lng: Number(lng) };
    setCoords(newCoords);
    setLocationName(name || 'Selected Location');
    setLocationDenied(false);
    localStorage.setItem('user_coords', JSON.stringify(newCoords));
    localStorage.setItem('user_location_name', name || 'Selected Location');
  };

  return (
    <LocationContext.Provider
      value={{
        coords,
        locationName,
        isLocating,
        locationDenied,
        requestLocation,
        setManualLocation,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};
