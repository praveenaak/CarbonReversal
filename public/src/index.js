import { basemap1, baseMaps } from './basemap.js';

document.addEventListener('DOMContentLoaded', () => {
  const map = L.map('map').setView([37.8, -96.9], 5);
  map.invalidateSize();

  // Add the initial basemap to the map
  basemap1.addTo(map);

  // Clear any existing options in basemapOptions to prevent duplicates
  const basemapOptions = document.getElementById('basemapOptions');
  basemapOptions.innerHTML = ''; // Clear any existing content

  // Add custom control for basemap selection
  Object.keys(baseMaps).forEach((name) => {
    const div = document.createElement('div');
    div.className = 'basemap-option';

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

    div.appendChild(input);
    div.appendChild(label);
    basemapOptions.appendChild(div);
  });

  // Create a Web Worker
  const worker = new Worker('./src/worker.js');

  // Function to interpolate between two colors
  function interpolateColor(color1, color2, factor) {
    const result = color1.slice();
    for (let i = 0; i < 3; i++) {
      result[i] = Math.round(result[i] + factor * (color2[i] - color1[i]));
    }
    return result;
  }

  // Function to convert RGB to hex
  function rgbToHex(rgb) {
    return "#" + rgb.map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    }).join('');
  }

  // Function to get color based on raster_value and min/max values
  function getColor(rasterValue, minValue, maxValue) {
    const lowColor = [255, 255, 204];  // Light yellow
    const highColor = [128, 0, 38];    // Dark red

    const factor = (rasterValue - minValue) / (maxValue - minValue);
    const interpolatedRgb = interpolateColor(lowColor, highColor, factor);
    return rgbToHex(interpolatedRgb);
  }

  // Function to style each feature
  function style(feature, minValue, maxValue) {
    return {
      fillColor: getColor(feature.properties.raster_value, minValue, maxValue),
      weight: 0,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7
    };
  }

  // Array of GeoJSON file paths
  const geojsonFiles = [
    './data/combinedRisk_absReversal_8km_ssp245.geojson',
    './data/combinedRisk_absReversal_8km_ssp585.geojson',
    './data/drought_bufferPool_8km_ssp245.geojson',
    './data/fire_bufferPool_8km_ssp245.geojson',
    './data/insect_bufferPool_8km_ssp245.geojson'
  ];

  // Object to hold the layers and their metadata
  const geojsonLayers = {};

  // Function to set up layer toggles with lazy loading
  function setupLayerToggles() {
    const layerToggle = document.getElementById('layerToggle');
    layerToggle.innerHTML = ''; // Clear any existing content
    
    geojsonFiles.forEach((file, index) => {
      const layerName = file.split('/').pop().split('.')[0];
      
      const input = document.createElement('input');
      input.type = 'checkbox';
      input.id = layerName;
      input.checked = false;
      
      input.addEventListener('change', (e) => {
        if (e.target.checked) {
          if (!geojsonLayers[layerName]) {
            worker.postMessage({ type: 'loadGeoJSON', url: file });
            worker.onmessage = function(e) {
              if (e.data.type === 'geoJSONLoaded') {
                const { data, minValue, maxValue } = e.data;
                const layer = L.geoJSON(data, { 
                  style: (feature) => style(feature, minValue, maxValue)
                });
                geojsonLayers[layerName] = { layer, minValue, maxValue };
                layer.addTo(map);
                updateLegend(layerName, minValue, maxValue);
              }
            };
          } else {
            geojsonLayers[layerName].layer.addTo(map);
            updateLegend(layerName, geojsonLayers[layerName].minValue, geojsonLayers[layerName].maxValue);
          }
        } else if (geojsonLayers[layerName]) {
          map.removeLayer(geojsonLayers[layerName].layer);
          removeLegend();
        }
      });

      const label = document.createElement('label');
      label.htmlFor = layerName;
      label.appendChild(document.createTextNode(layerName));
      
      layerToggle.appendChild(input);
      layerToggle.appendChild(label);
      layerToggle.appendChild(document.createElement('br'));
    });
  }

  // Set up layer toggles
  setupLayerToggles();

  // Function to update the legend
  function updateLegend(layerName, minValue, maxValue) {
    removeLegend(); // Remove existing legend

    const legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {
      const div = L.DomUtil.create('div', 'info legend');
      const grades = [0, 0.2, 0.4, 0.6, 0.8, 1];
      let labels = [`<h4>${layerName}</h4>`];

      for (let i = 0; i < grades.length; i++) {
        const value = minValue + (maxValue - minValue) * grades[i];
        const nextValue = i < grades.length - 1 ? minValue + (maxValue - minValue) * grades[i + 1] : maxValue;
        labels.push(
          '<i style="background:' + getColor(value, minValue, maxValue) + '"></i> ' +
          value.toFixed(2) + (nextValue ? '&ndash;' + nextValue.toFixed(2) : '+')
        );
      }

      div.innerHTML = labels.join('<br>');
      return div;
    };

    legend.addTo(map);
  }

  // Function to remove the legend
  function removeLegend() {
    const legendElements = document.getElementsByClassName('info legend');
    while(legendElements.length > 0){
      legendElements[0].parentNode.removeChild(legendElements[0]);
    }
  }

  // Add search functionality
  const geocoder = L.Control.Geocoder.nominatim();
  let marker;

  map.on('click', function(e) {
    geocoder.reverse(e.latlng, map.options.crs.scale(map.getZoom()), function(results) {
      var r = results[0];
      if (r) {
        if (marker) {
          marker.setLatLng(r.center).setPopupContent(r.html || r.name).openPopup();
        } else {
          marker = L.marker(r.center).bindPopup(r.name).addTo(map).openPopup();
        }
      }
    });
  });

  function performSearch(query) {
    geocoder.geocode(query, function(results) {
      if (results.length > 0) {
        var r = results[0];
        if (r.bbox) {
          var southWest = L.latLng(r.bbox.getSouthWest()),
              northEast = L.latLng(r.bbox.getNorthEast());
          map.fitBounds(L.latLngBounds(southWest, northEast));
        } else {
          map.fitBounds(r.center.toBounds(1000));
        }
        if (marker) {
          marker.setLatLng(r.center).setPopupContent(r.html || r.name).openPopup();
        } else {
          marker = L.marker(r.center).bindPopup(r.name).addTo(map).openPopup();
        }
      }
    });
  }

  const searchInput = document.getElementById('searchInput');
  const searchButton = document.getElementById('searchButton');

  searchButton.addEventListener('click', function() {
    const query = searchInput.value;
    performSearch(query);
  });

  searchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      const query = searchInput.value;
      performSearch(query);
    }
  });
});