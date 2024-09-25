import React from 'react';
import { Layers } from 'lucide-react';
import { basemaps } from './basemaps';

const BasemapControl = ({ isBasemapOpen, setIsBasemapOpen, activeBasemap, setActiveBasemap }) => (
  <div style={{
    position: 'absolute',
    top: '80px',
    right: '10px',
    backgroundColor: 'white',
    padding: '10px',
    borderRadius: '4px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    zIndex: 1
  }}>
    <button 
      onClick={() => setIsBasemapOpen(!isBasemapOpen)}
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Layers size={24} />
    </button>
    {isBasemapOpen && (
      <div style={{ marginTop: '10px' }}>
        {basemaps.map((basemap) => (
          <div key={basemap.id} style={{ marginBottom: '5px' }}>
            <input
              type="radio"
              id={basemap.id}
              name="basemap"
              checked={activeBasemap === basemap.id}
              onChange={() => setActiveBasemap(basemap.id)}
            />
            <label htmlFor={basemap.id} style={{ marginLeft: '5px', fontSize: '12px' }}>
              {basemap.name}
            </label>
          </div>
        ))}
      </div>
    )}
  </div>
);

export default BasemapControl;