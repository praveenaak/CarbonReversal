// src/index.js
import { basemap1, baseMaps } from './basemap.js';


document.addEventListener('DOMContentLoaded', () => {
  const map = L.map('map').setView([37.8, -96.9], 5);

  // Add the initial basemap to the map
  basemap1.addTo(map);

  // Clear any existing options in basemapOptions to prevent duplicates
  const basemapOptions = document.getElementById('basemapOptions');
  basemapOptions.innerHTML = ''; // Clear any existing content

  // Add custom control for basemap selection
  Object.keys(baseMaps).forEach((name) => {
    const input = document.createElement('input');
    input.type = 'radio';
    input.name = 'basemap';
    input.value = name;
    input.id = name;
    input.addEventListener('change', () => {
      map.eachLayer((layer) => {
        if (layer instanceof L.TileLayer) {
          map.removeLayer(layer);
        }
      });
      baseMaps[name].addTo(map);
    });

    const label = document.createElement('label');
    label.htmlFor = name;
    label.textContent = name;

    basemapOptions.appendChild(input);
    basemapOptions.appendChild(label);
  });

  // Function to get color based on a property value
  function getColor(value) {
    return value > 40 ? '#800026' :
           value > 30  ? '#BD0026' :
           value > 20  ? '#E31A1C' :
           value > 10  ? '#FC4E2A' :
           value > 5   ? '#FD8D3C' :
           value > 2   ? '#FEB24C' :
           value > 1   ? '#FED976' :
                          '#FFEDA0';
  }

  // Style function for GeoJSON layer
  function style(feature) {
    return {
      fillColor: getColor(feature.properties.raster_value), // Change 'value' to the property you want to use
      weight: 0.5,
      opacity: 1,
      color: 'white',
      dashArray: '1',
      fillOpacity: 0.7
    };
  }

  

  // Load GeoJSON data and add it as a layer with style
  let geoJsonLayer;
  fetch('data/output.geojson')
    .then(response => response.json())
    .then(data => {
      geoJsonLayer = L.geoJSON(data, { style: style }).addTo(map);
    });

  // Add a button to toggle the GeoJSON layer
  const toggleButton = document.createElement('button');
  toggleButton.textContent = 'Toggle GeoJSON Layer';
  toggleButton.addEventListener('click', () => {
    if (map.hasLayer(geoJsonLayer)) {
      map.removeLayer(geoJsonLayer);
    } else {
      map.addLayer(geoJsonLayer);
    }
  });

  document.getElementById('layerControl').appendChild(toggleButton);



});