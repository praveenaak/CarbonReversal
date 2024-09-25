import React, { useState } from 'react';
import Map, { Source, Layer } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;

console.log('Mapbox Token:', MAPBOX_TOKEN); // Log the token to verify it's loaded

const layers = [
  {
    id: 'CombinedRisk_ssp245',
    source: {
      type: 'vector',
      url: 'mapbox://pkulandh.comrisk_absreversal_8km_ssp245',
    },
    layer: {
      id: 'CombinedRisk_ssp245',
      type: 'circle',
      source: 'CombinedRisk_ssp245',
      'source-layer': 'combinedRisk_absReversal_8km_ssp245',
      paint: {
        'circle-radius': 3,
        'circle-color': [
          'interpolate',
          ['linear'],
          ['get', 'raster_value'],
          0, '#ffffd4',
          25, '#fed98e',
          50, '#fe9929',
          75, '#d95f0e',
          100, '#993404'
        ],
      },
    },
  },
  {
    id: 'InsectBufferPool',
    source: {
      type: 'vector',
      url: 'mapbox://pkulandh.insect_bufferpool_8km_ssp245',
    },
    layer: {
      id: 'InsectBufferPool',
      type: 'fill',
      source: 'InsectBufferPool',
      'source-layer': 'insect_bufferPool_8km_ssp245',
      paint: {
        'fill-color': [
          'interpolate',
          ['linear'],
          ['get', 'raster_value'],
          0, '#ffffd4',
          3, '#fee391',
          5, '#fec44f',
          10, '#fe9929',
          20, '#ec7014',
          30, '#cc4c02',
          60, '#993404',
          80, '#662506',
          100, '#331303',
          300, '#000000'
        ],
        'fill-opacity': 0.7,
      },
    },
  },
  {
    id: 'DroughtBufferPool',
    source: {
      type: 'vector',
      url: 'mapbox://pkulandh.drought_bufferpool_8km_ssp245',
    },
    layer: {
      id: 'DroughtBufferPool',
      type: 'fill',
      source: 'DroughtBufferPool',
      'source-layer': 'drought_bufferPool_8km_ssp245',
      paint: {
        'fill-color': [
          'interpolate',
          ['linear'],
          ['get', 'raster_value'],
          0, '#ffffd4',
          3, '#fee391',
          5, '#fec44f',
          10, '#fe9929',
          20, '#ec7014',
          30, '#cc4c02',
          60, '#993404',
          80, '#662506',
          100, '#331303',
          300, '#000000'
        ],
        'fill-opacity': 0.7,
      },
    },
  },
  {
    id: 'CombinedRisk_ssp585',
    source: {
      type: 'vector',
      url: 'mapbox://pkulandh.comrisk_absreversal_8km_ssp585',
    },
    layer: {
      id: 'CombinedRisk_ssp585',
      type: 'fill',
      source: 'CombinedRisk_ssp585',
      'source-layer': 'combinedRisk_absReversal_8km_ssp585',
      paint: {
        'fill-color': '#FFFF00',
        'fill-opacity': 0.4,
      },
    },
  },
  {
    id: 'FireBufferPool',
    source: {
      type: 'vector',
      url: 'mapbox://pkulandh.fire_bufferpool_8km_ssp245',
    },
    layer: {
      id: 'FireBufferPool',
      type: 'fill',
      source: 'FireBufferPool',
      'source-layer': 'fire_bufferPool_8km_ssp245',
      paint: {
        'fill-color': [
          'interpolate',
          ['linear'],
          ['get', 'raster_value'],
          0, '#ffffd4',
          3, '#fee391',
          5, '#fec44f',
          10, '#fe9929',
          20, '#ec7014',
          30, '#cc4c02',
          60, '#993404',
          80, '#662506',
          100, '#331303',
          300, '#000000'
        ],
        'fill-opacity': 0.7,
      },
    },
  },
];

const basemaps = [
  { id: 'streets', name: 'Streets', style: 'mapbox://styles/mapbox/streets-v11' },
  { id: 'satellite', name: 'Satellite', style: 'mapbox://styles/mapbox/satellite-v9' },
  { id: 'topography', name: 'Topography', style: 'mapbox://styles/mapbox/outdoors-v11' },
];

const MapComponent = () => {
  const [viewport, setViewport] = useState({
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 8,
  });

  const [activeLayers, setActiveLayers] = useState([]);
  const [activeBasemap, setActiveBasemap] = useState(basemaps[0].id);

  const toggleLayer = (layerId) => {
    setActiveLayers((prev) =>
      prev.includes(layerId)
        ? prev.filter((id) => id !== layerId)
        : [...prev, layerId]
    );
  };

  const formatLayerName = (name) => {
    return name
      .split(/(?=[A-Z])/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
      .replace(/Ssp/g, 'SSP')
      .replace(/Km/g, 'km');
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ width: '300px', padding: '10px', background: '#f8f8f8', overflowY: 'auto' }}>
        <h3>Basemaps</h3>
        {basemaps.map((basemap) => (
          <div key={basemap.id} style={{ marginBottom: '10px' }}>
            <input
              type="radio"
              id={basemap.id}
              name="basemap"
              checked={activeBasemap === basemap.id}
              onChange={() => setActiveBasemap(basemap.id)}
            />
            <label htmlFor={basemap.id} style={{ marginLeft: '5px' }}>
              {basemap.name}
            </label>
          </div>
        ))}
        <h3>Layers</h3>
        {layers.map((layer) => (
          <div key={layer.id} style={{ marginBottom: '10px' }}>
            <input
              type="checkbox"
              id={layer.id}
              checked={activeLayers.includes(layer.id)}
              onChange={() => toggleLayer(layer.id)}
            />
            <label htmlFor={layer.id} style={{ marginLeft: '5px' }}>
              {formatLayerName(layer.layer['source-layer'])}
            </label>
          </div>
        ))}
      </div>
      <div style={{ flex: 1 }}>
        <Map
          {...viewport}
          style={{width: '100%', height: '100%'}}
          mapStyle={basemaps.find(b => b.id === activeBasemap).style}
          mapboxAccessToken={MAPBOX_TOKEN}
          onMove={(evt) => setViewport(evt.viewState)}
        >
          {activeLayers.map((layerId) => {
            const layer = layers.find((l) => l.id === layerId);
            return (
              <Source key={layer.id} {...layer.source}>
                <Layer {...layer.layer} />
              </Source>
            );
          })}
        </Map>
      </div>
    </div>
  );
};

export default MapComponent;