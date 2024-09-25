import React, { useState, useEffect } from 'react';

const Legend = ({ layer, onRangeChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [ranges, setRanges] = useState([]);
  const [tempRanges, setTempRanges] = useState([]);

  useEffect(() => {
    const colorScale = layer.layer.paint['fill-color'];
    if (Array.isArray(colorScale) && colorScale[0] === 'interpolate') {
      const stops = colorScale.slice(3);
      const initialRanges = [];
      for (let i = 0; i < stops.length; i += 2) {
        initialRanges.push({ value: stops[i], color: stops[i + 1] });
      }
      setRanges(initialRanges);
      setTempRanges(initialRanges);
    }
  }, [layer]);

  const handleTempRangeChange = (index, field, value) => {
    const newTempRanges = [...tempRanges];
    newTempRanges[index][field] = field === 'value' ? parseFloat(value) : value;
    setTempRanges(newTempRanges);
  };

  const handleSave = () => {
    setRanges(tempRanges);
    onRangeChange(tempRanges);
  };

  const layerName = layer.name || layer.id;

  return (
    <div style={{ 
      backgroundColor: 'white', 
      borderRadius: '5px', 
      marginBottom: '10px',
      boxShadow: '0 0 10px rgba(0,0,0,0.1)',
      overflow: 'hidden'
    }}>
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          width: '100%',
          padding: '10px',
          textAlign: 'left',
          background: 'none',
          border: 'none',
          borderBottom: isExpanded ? '1px solid #eee' : 'none',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
      >
        {layerName}
      </button>
      {isExpanded && (
        <div style={{ padding: '10px' }}>
          <h4 style={{ marginTop: 0, marginBottom: '10px' }}>{layerName}</h4>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {tempRanges.map((range, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                <input
                  type="color"
                  value={range.color}
                  onChange={(e) => handleTempRangeChange(index, 'color', e.target.value)}
                  style={{ width: '30px', height: '30px', marginRight: '10px' }}
                />
                <input
                  type="number"
                  value={range.value}
                  onChange={(e) => handleTempRangeChange(index, 'value', e.target.value)}
                  style={{ width: '60px', marginRight: '10px' }}
                />
                <span>{range.value} {tempRanges[index + 1] ? `- ${tempRanges[index + 1].value}` : '+'}</span>
              </div>
            ))}
          </div>
          <button 
            onClick={handleSave}
            style={{
              marginTop: '10px',
              padding: '5px 10px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '3px',
              cursor: 'pointer'
            }}
          >
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
};

export default Legend;