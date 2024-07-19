// src/components/Tooltip.js

import React from 'react';
import './Tooltip.css';

const Tooltip = ({ data, position }) => {
  const { x, y } = position;

  return (
    <div className="tooltip"  >
      {data.map((item, index) => (
        <div key={index}>
          <p>Type: {item.type}</p>
          <p>Title: {item.title}</p>
          {item.href && <a href={item.href}>Link</a>}
          {index < data.length - 1 && <hr />}
        </div>
      ))}
    </div>
  );
};

export default Tooltip;
