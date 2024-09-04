// worker.js

self.addEventListener('message', function(e) {
    if (e.data.type === 'loadGeoJSON') {
      loadGeoJSON(e.data.url);
    }
  });
  
  function loadGeoJSON(url) {
    fetch(url)
      .then(response => response.json())
      .then(data => {
        let minValue = Infinity;
        let maxValue = -Infinity;
        data.features.forEach(feature => {
          const value = feature.properties.raster_value;
          minValue = Math.min(minValue, value);
          maxValue = Math.max(maxValue, value);
        });
        self.postMessage({ type: 'geoJSONLoaded', data, minValue, maxValue });
      })
      .catch(error => console.error('Error loading GeoJSON:', error));
  }