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


});