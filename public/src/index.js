document.addEventListener('DOMContentLoaded', () => {
  const map = L.map('map').setView([37.8, -96.9], 5);

  const basemap1 = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  const basemap2 = L.tileLayer('https://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles courtesy of the <a href="https://usgs.gov/">U.S. Geological Survey</a>'
  });

  const basemap3 = L.tileLayer('https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryTopo/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles courtesy of the <a href="https://usgs.gov/">U.S. Geological Survey</a>'
  });

  const baseMaps = {
    "OpenStreetMap": basemap1,
    "USGS Topo Map": basemap2,
    "USGS Imagery Topo": basemap3
  };

  // Add the initial basemap to the map
  basemap1.addTo(map);

  // Clear any existing options in basemapOptions to prevent duplicates
  const basemapOptions = document.getElementById('basemapOptions');
  basemapOptions.innerHTML = ''; // Clear any existing content

  // Add custom control for basemap selection
  Object.keys(baseMaps).forEach((name) => {
    const div = document.createElement('div');
    const input = document.createElement('input');
    input.type = 'radio';
    input.name = 'basemap';
    input.value = name;
    input.id = name;
    if (name === "OpenStreetMap") input.checked = true;
    input.addEventListener('change', () => {
      // Remove all tile layers before adding the new one
      Object.values(baseMaps).forEach(layer => {
        if (map.hasLayer(layer)) {
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

  // Add event listeners for area selection
  document.getElementById('us').addEventListener('change', () => {
    map.setView([37.8, -96.9], 5); // Center on CONUS
  });

  document.getElementById('world').addEventListener('change', () => {
    map.setView([20, 0], 3); // Center on World
  });

  // Add search control to the custom container
  const searchControl = L.Control.geocoder({
    defaultMarkGeocode: false
  }).on('markgeocode', function(e) {
    const bbox = e.geocode.bbox;
    map.fitBounds(bbox);
  });
  searchControl.options.position = 'topleft';
  searchControl.options.expand = 'fullWidth';
  const searchContainer = document.getElementById('searchControl');
  searchControl.addTo(map);
  searchContainer.appendChild(searchControl.getContainer());
});