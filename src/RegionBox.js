import React, { useMemo } from 'react';

const RegionBox = ({ viewport }) => {
  const region = useMemo(() => {
    const { latitude, longitude, zoom } = viewport;
    
    if (zoom < 3) return 'World';
    if (latitude > 66.5) return 'Arctic';
    if (latitude < -66.5) return 'Antarctic';
    
    if (longitude >= -180 && longitude < -30) {
      return 'Americas';
    } else if (longitude >= -30 && longitude < 60) {
      return 'Europe/Africa';
    } else if (longitude >= 60 && longitude < 150) {
      return 'Asia';
    } else {
      return 'Oceania';
    }
  }, [viewport]);

  return (
    <div style={{
      position: 'absolute',
      bottom: '20px',
      right: '10px',
      backgroundColor: 'rgba(255, 255, 255, 0.7)',
      padding: '5px 10px',
      borderRadius: '4px',
      fontSize: '14px',
      fontWeight: 'bold',
      boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    }}>
      Region: {region}
    </div>
  );
};

export default RegionBox;