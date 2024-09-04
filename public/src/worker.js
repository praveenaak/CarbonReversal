self.addEventListener('message', function(e) {
    if (e.data.type === 'loadGeoJSON') {
      loadGeoJSON(e.data.url, e.data.isHexagon);
    }
  });
  
  function loadGeoJSON(url, isHexagon) {
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
        self.postMessage({ type: 'geoJSONLoaded', data, minValue, maxValue, isHexagon });
      })
      .catch(error => console.error('Error loading GeoJSON:', error));
  }