self.addEventListener('message', function(e) {
    if (e.data.type === 'loadGeoJSON') {
      loadGeoJSON(e.data.url);
    }
  });
  
  function loadGeoJSON(url) {
    console.log('Worker: Attempting to fetch:', url);
    
    fetch(url)
      .then(response => {
        console.log('Worker: Response status:', response.status);
        console.log('Worker: Response headers:', JSON.stringify([...response.headers]));
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return response.text(); // Get the response as text first
      })
      .then(text => {
        console.log('Worker: Response text (first 200 chars):', text.substring(0, 200));
        
        try {
          const data = JSON.parse(text); // Attempt to parse the text as JSON
          console.log('Worker: JSON parsed successfully');
          return data;
        } catch (error) {
          console.error('Worker: JSON parsing error:', error);
          throw new Error('Failed to parse JSON: ' + error.message);
        }
      })
      .then(data => {
        console.log('Worker: Processing GeoJSON data');
        let minValue = Infinity;
        let maxValue = -Infinity;
        
        data.features.forEach(feature => {
          const value = feature.properties.raster_value;
          minValue = Math.min(minValue, value);
          maxValue = Math.max(maxValue, value);
        });
        
        console.log('Worker: Data processed. Min:', minValue, 'Max:', maxValue);
        self.postMessage({ type: 'geoJSONLoaded', data, minValue, maxValue });
      })
      .catch(error => {
        console.error('Worker: Error loading or processing GeoJSON:', error);
        self.postMessage({ type: 'error', message: error.toString() });
      });
  }