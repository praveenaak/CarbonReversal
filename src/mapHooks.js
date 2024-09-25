import { useState, useEffect } from 'react';
import { layers, additionalCompositeUrls, additionalCompositeHighUrls } from './layers';

export const useMapLayers = (map, activeLayers, activeBasemap) => {
    useEffect(() => {
      if (map) {
        const addCompositeLayers = (baseLayerId, additionalUrls) => {
          if (activeLayers.includes(baseLayerId)) {
            additionalUrls.forEach((url, index) => {
              const sourceId = `${baseLayerId}_${index + 2}`;
              const layerId = `${baseLayerId}_${index + 2}`;
              
              // Remove existing layer and source if they exist
              if (map.getLayer(layerId)) {
                map.removeLayer(layerId);
              }
              if (map.getSource(sourceId)) {
                map.removeSource(sourceId);
              }
  
              map.addSource(sourceId, {
                type: 'vector',
                url: url,
              });
              const layer = layers.find(l => l.id === baseLayerId);
              const modifiedLayer = modifyLayerStyle(layer.layer);
              
              let sourceLayerName;
              if (baseLayerId === 'compositeGbfLowSsp245') {
                sourceLayerName = `gBF_low_ssp245_part_${index + 2}_processed`;
              } else if (baseLayerId === 'compositeGbfHighSsp245') {
                sourceLayerName = `gBF_high_ssp245_part_${index + 2}_processed`;
              }
              
              map.addLayer({
                ...modifiedLayer,
                id: layerId,
                source: sourceId,
                'source-layer': sourceLayerName,
              });
            });
          }
        };
  
        addCompositeLayers('compositeGbfLowSsp245', additionalCompositeUrls);
        addCompositeLayers('compositeGbfHighSsp245', additionalCompositeHighUrls);
      }
    }, [map, activeLayers, activeBasemap]);
  
    useEffect(() => {
      if (map) {
        layers.forEach(layer => {
          const mapLayer = map.getLayer(layer.id);
          if (mapLayer) {
            map.setLayoutProperty(
              layer.id,
              'visibility',
              activeLayers.includes(layer.id) ? 'visible' : 'none'
            );
          }
        });
  
        const setLayersVisibility = (baseLayerId, additionalUrls) => {
          if (activeLayers.includes(baseLayerId)) {
            additionalUrls.forEach((_, index) => {
              const layerId = `${baseLayerId}_${index + 2}`;
              if (map.getLayer(layerId)) {
                map.setLayoutProperty(layerId, 'visibility', 'visible');
              }
            });
          } else {
            additionalUrls.forEach((_, index) => {
              const layerId = `${baseLayerId}_${index + 2}`;
              if (map.getLayer(layerId)) {
                map.setLayoutProperty(layerId, 'visibility', 'none');
              }
            });
          }
        };
  
        setLayersVisibility('compositeGbfLowSsp245', additionalCompositeUrls);
        setLayersVisibility('compositeGbfHighSsp245', additionalCompositeHighUrls);
      }
    }, [map, activeLayers, activeBasemap]);
  };


  const modifyLayerStyle = (layer) => {
    const newLayer = { ...layer };
    if (newLayer.type === 'fill') {
      newLayer.paint = {
        'fill-color': [
          'interpolate',
          ['linear'],
          ['get', 'raster_value'],
          0, 'rgba(0, 0, 0, 0)',
          1, '#ffffd4',
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
        'fill-opacity': [
          'interpolate',
          ['linear'],
          ['zoom'],
          0, 0.9,
          4, 0.6,
          6, 0.3
        ]
      };
  
      // Remove the fill-outline-color for all GBF layers
      if (!layer.id.startsWith('compositeGbf')) {
        newLayer.paint['fill-outline-color'] = [
          'interpolate',
          ['linear'],
          ['zoom'],
          0, 'rgba(255, 255, 255, 0)',
          5, 'white'
        ];
      }
    }
    return newLayer;
  };
  
  
export const useViewport = (initialViewport) => {
  const [viewport, setViewport] = useState(initialViewport);

  const handleViewportChange = (newViewport) => {
    const zoom = Math.max(Math.min(newViewport.zoom, viewport.maxZoom), viewport.minZoom);
    const latitude = Math.max(Math.min(newViewport.latitude, 85), -85);
    const longitude = ((newViewport.longitude + 180) % 360) - 180;

    setViewport(prevViewport => ({
      ...prevViewport,
      latitude: isNaN(latitude) ? prevViewport.latitude : latitude,
      longitude: isNaN(longitude) ? prevViewport.longitude : longitude,
      zoom: isNaN(zoom) ? prevViewport.zoom : zoom,
    }));
  };

  return [viewport, handleViewportChange];
};