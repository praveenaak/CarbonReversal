import React from 'react';

const ViewToggleButton = ({ view, setView }) => {
  return (
    <button
      onClick={() => setView(view === 'US' ? 'Global' : 'US')}
      style={{
        position: 'absolute',
        right: '40px',
        bottom: '990px',
        zIndex: 1,
        padding: '10px',
        backgroundColor: 'white',
        border: '1px solid #ccc',
        borderRadius: '4px',
        cursor: 'pointer'
      }}
    >
      {view === 'US' ? 'Switch to Global' : 'Switch to US'}
    </button>
  );
};

export default ViewToggleButton;