import React from 'react';
import { MAPBOX_TOKEN } from './constants';
import { Search } from 'lucide-react';

const SearchBar = ({ searchQuery, setSearchQuery, fitBounds, handleViewportChange, viewport }) => {
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery) return;

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery)}.json?access_token=${MAPBOX_TOKEN}`
      );
      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const [feature] = data.features;
        if (feature.bbox) {
          fitBounds(feature.bbox);
        } else if (feature.center) {
          const [longitude, latitude] = feature.center;
          handleViewportChange({
            ...viewport,
            longitude,
            latitude,
            zoom: 10,
          });
        }
      } else {
        alert('Location not found');
      }
    } catch (error) {
      console.error('Error searching for location:', error);
      alert('Error searching for location');
    }
  };

  return (
    <form onSubmit={handleSearch} style={styles.form}>
      <div style={styles.inputContainer}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for a location"
          style={styles.input}
        />
        <button type="submit" style={styles.button}>
          <Search size={20} />
        </button>
      </div>
    </form>
  );
};

const styles = {
  form: {
    marginBottom: '20px',
  },
  inputContainer: {
    display: 'flex',
    position: 'relative',
    width: '100%',
  },
  input: {
    width: '100%',
    padding: '10px 40px 10px 15px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '20px',
    outline: 'none',
    transition: 'all 0.3s',
  },
  button: {
    position: 'absolute',
    right: '5px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '5px',
    color: '#555',
    transition: 'all 0.3s',
  },
};

export default SearchBar;