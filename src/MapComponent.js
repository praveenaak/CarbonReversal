import React, { useState, useRef, useEffect } from 'react';
import Map, { Source, Layer, Popup, ScaleControl, NavigationControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { layers, additionalCompositeUrls } from './layers';
import { basemaps } from './basemaps';
import { formatLayerName } from './utils';
import { MAPBOX_TOKEN } from './constants';
import BasemapControl from './BasemapControl';
import SearchBar from './SearchBar';
import LayerControl from './LayerControl';
import { useMapLayers, useViewport } from './mapHooks';
import ViewToggleButton from './ViewToggleButton';
import MiniMap from './MiniMap';

const MapComponent = () => {
  const initialViewport = {
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 5,
    minZoom: 2,
    maxZoom: 12
  };

  const [viewport, handleViewportChange] = useViewport(initialViewport);
  const [isBasemapOpen, setIsBasemapOpen] = useState(false);
  const [activeLayers, setActiveLayers] = useState([]);
  const [activeBasemap, setActiveBasemap] = useState(basemaps[0].id);
  const [map, setMap] = useState(null);
  const [popupInfo, setPopupInfo] = useState(null);
  const [clickedFeature, setClickedFeature] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [view, setView] = useState('Global');
  const mapRef = useRef();

  useEffect(() => {
    console.log('Current zoom level:', viewport.zoom);
  }, [viewport.zoom]);

  useEffect(() => {
    if (map) {
      const addSourceIfNotExists = (sourceId, sourceConfig) => {
        if (!map.getSource(sourceId)) {
          map.addSource(sourceId, sourceConfig);
        }
      };

      // Preload compositeGbfLowSsp245 layer
      const gbfLowLayer = layers.find(l => l.id === 'compositeGbfLowSsp245');
      if (gbfLowLayer) {
        addSourceIfNotExists('compositeGbfLowSsp245', gbfLowLayer.source);
      }

      // Preload additional composite layers
      additionalCompositeUrls.forEach((url, index) => {
        const sourceId = `compositeGbfLowSsp245_${index + 2}`;
        addSourceIfNotExists(sourceId, {
          type: 'vector',
          url: url,
        });
      });
    }
  }, [map]);

  useMapLayers(map, activeLayers, activeBasemap);

  const layerGroups = {
    combinedRisk: {
      name: 'Combined Risk Absolute Reversal',
      variants: ['ssp245', 'ssp585'],
      layers: {
        ssp245: 'CombinedRisk_ssp245',
        ssp585: 'CombinedRisk_ssp585'
      }
    },
    bufferPool: {
      name: 'Buffer Pool',
      variants: ['Insect', 'Drought', 'Fire'],
      layers: {
        Insect: 'InsectBufferPool',
        Drought: 'DroughtBufferPool',
        Fire: 'FireBufferPool'
      }
    },
    globalBufferPool: {
      name: 'Global Buffer Pool',
      variants: ['low'],
      layers: {
        low: 'compositeGbfLowSsp245'
      }
    }
  };

  const handleLegendRangeChange = (layerId, newRanges) => {
    if (map) {
      const layer = map.getLayer(layerId);
      if (layer) {
        const newColorScale = ['interpolate', ['linear'], ['get', 'raster_value']];
        newRanges.forEach(range => {
          newColorScale.push(range.value, range.color);
        });
        map.setPaintProperty(layerId, 'fill-color', newColorScale);
      }
    }
  };

  const handleMapClick = (event) => {
    if (!map) return;

    const features = map.queryRenderedFeatures(event.point);
    
    const activeFeatures = features.filter(feature => {
      const layerId = feature.layer.id;
      return activeLayers.includes(layerId) || 
             activeLayers.some(activeLayer => layerId.startsWith(`${activeLayer}_`));
    });
    
    if (activeFeatures.length > 0) {
      const feature = activeFeatures[0];
      setPopupInfo({
        lngLat: event.lngLat,
        layerName: formatLayerName(feature.layer['source-layer'] || feature.layer.id),
        value: feature.properties.raster_value
      });
      setClickedFeature(feature);
    } else {
      setPopupInfo(null);
      setClickedFeature(null);
    }
  };

  const toggleLayer = (groupId, variantId) => {
    const layerId = layerGroups[groupId].layers[variantId];
    setActiveLayers((prev) => {
      const newLayers = prev.includes(layerId)
        ? prev.filter((id) => id !== layerId)
        : [...prev, layerId];
      console.log('Toggled layer, new active layers:', newLayers);
      return newLayers;
    });
  };

  const highlightLayerStyle = {
    id: 'highlight-layer',
    type: 'line',
    paint: {
      'line-color': 'white',
      'line-width': 4,
      'line-opacity': 1
    }
  };

  const fitBounds = (bounds) => {
    if (mapRef.current && bounds && bounds.length === 4) {
      const [west, south, east, north] = bounds;
      if (!isNaN(west) && !isNaN(south) && !isNaN(east) && !isNaN(north)) {
        mapRef.current.fitBounds(
          [
            [west, south],
            [east, north]
          ],
          { padding: 40, duration: 1000 }
        );
      } else {
        console.error('Invalid bounds:', bounds);
      }
    }
  };

  const zoomToView = (selectedView) => {
    if (selectedView === 'US') {
      mapRef.current.flyTo({
        center: [-98.5795, 39.8283],
        zoom: 4,
        duration: 2000
      });
    } else {
      mapRef.current.flyTo({
        center: [0, 20],
        zoom: 2,
        duration: 2000
      });
    }
  };

  const handleViewToggle = (newView) => {
    setView(newView);
    zoomToView(newView);
  };

  const handleBasemapChange = (newBasemap) => {
    console.log('Changing basemap to:', newBasemap);
    console.log('Current active layers:', activeLayers);
    
    // Clear all active layers
    setActiveLayers([]);
    
    // If you have a map instance, you can also remove layers directly
    if (map) {
      activeLayers.forEach(layerId => {
        if (map.getLayer(layerId)) {
          map.removeLayer(layerId);
        }
        // Also remove any associated source
        if (map.getSource(layerId)) {
          map.removeSource(layerId);
        }
      });
    }
    
    setActiveBasemap(newBasemap);
    console.log('Layers cleared, new active layers:', []);
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ width: '300px', padding: '10px', background: '#f8f8f8', overflowY: 'auto' }}>
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          fitBounds={fitBounds}
          handleViewportChange={handleViewportChange}
          viewport={viewport}
        />
        <LayerControl
          layerGroups={layerGroups}
          activeLayers={activeLayers}
          toggleLayer={toggleLayer}
          layers={layers}
          onLegendRangeChange={handleLegendRangeChange}
        />
      </div>
      <div style={{ flex: 1, position: 'relative' }}>
        <Map
          {...viewport}
          ref={mapRef}
          style={{width: '100%', height: '100%'}}
          mapStyle={basemaps.find(b => b.id === activeBasemap).style}
          mapboxAccessToken={MAPBOX_TOKEN}
          onMove={(evt) => handleViewportChange(evt.viewState)}
          onLoad={(event) => {
            console.log('Map loaded');
            setMap(event.target);
          }}
          onClick={handleMapClick}
        >
          {activeLayers.map((layerId) => {
            const layer = layers.find(l => l.id === layerId);
            return layer ? (
              <Source key={layer.id} id={layer.id} {...layer.source}>
                <Layer {...layer.layer} />
              </Source>
            ) : null;
          })}
          {clickedFeature && (
            <Source type="geojson" data={{ type: 'FeatureCollection', features: [clickedFeature] }}>
              <Layer {...highlightLayerStyle} />
            </Source>
          )}
          {popupInfo && (
            <Popup
              longitude={popupInfo.lngLat.lng}
              latitude={popupInfo.lngLat.lat}
              closeButton={true}
              closeOnClick={false}
              onClose={() => {
                setPopupInfo(null);
                setClickedFeature(null);
              }}
            >
              <div>
                <h3>{popupInfo.layerName}</h3>
                <p>Value: {popupInfo.value}</p>
              </div>
            </Popup>
          )}
          <NavigationControl showCompass={false} />
          <ScaleControl maxWidth={100} unit="imperial" style={{ bottom: 10, left: 10 }} />
        </Map>
        <BasemapControl
          isBasemapOpen={isBasemapOpen}
          setIsBasemapOpen={setIsBasemapOpen}
          activeBasemap={activeBasemap}
          setActiveBasemap={handleBasemapChange}
        />
        <ViewToggleButton view={view} setView={handleViewToggle} />
        {viewport.zoom > 5 && <MiniMap mainViewport={viewport} />}
      </div>
    </div>
  );
};

export default MapComponent;