import React, { useState} from 'react';

const Tooltip = ({ children, text }) => {
    const [showTooltip, setShowTooltip] = useState(false);
  
    return (
      <div
        onMouseOver={() => setShowTooltip(true)}
        onMouseOut={() => setShowTooltip(false)}
        style={{ position: 'relative', display: 'inline-block' }}
      >
        {children}
        {showTooltip && (
          <div
            style={{
              position: 'absolute',
              bottom: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              padding: '5px',
              color: 'white',
              backgroundColor: 'black',
              borderRadius: '5px',
              zIndex: 1000,
            }}
          >
            {text}
          </div>
        )}
      </div>
    );
  };
  export default Tooltip;