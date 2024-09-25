import React from 'react';
import Legend from './Legend';

const LayerControl = ({ layerGroups, activeLayers, toggleLayer, layers, onLegendRangeChange }) => {
  return (
    <>
      <h3>Layers</h3>
      {Object.entries(layerGroups).map(([groupId, group]) => (
        <div key={groupId} style={{ marginBottom: '20px' }}>
          <h4>{group.name}</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
            {group.variants.map((variant) => (
              <button
                key={variant}
                onClick={() => toggleLayer(groupId, variant)}
                style={{
                  padding: '5px 10px',
                  backgroundColor: activeLayers.includes(group.layers[variant]) ? '#4CAF50' : '#f1f1f1',
                  color: activeLayers.includes(group.layers[variant]) ? 'white' : 'black',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                {variant}
              </button>
            ))}
          </div>
        </div>
      ))}
      <h3>Legends</h3>
      {layers.filter(layer => activeLayers.includes(layer.id)).map((layer) => (
        <Legend 
        key={layer.id} 
        layer={layer} 
        onRangeChange={(newRanges) => onLegendRangeChange(layer.id, newRanges)}
        />
      ))}
    </>
  );
};

export default LayerControl;