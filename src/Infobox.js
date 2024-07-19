// src/components/InfoBox.js

import React from 'react';
import './Infobox.css';

const InfoBox = ({ data }) => {
  return (
    <div className="info-box">
      {data ? (
        data.values.map((item, index) => (
          <div key={index}>
            <p>Type: {item.type}</p>
            <p>Title: {item.title}</p>
            {item.summaryDescription && <p>{item.summaryDescription}</p>}
            {item.href && <a href={item.href}>Link</a>}
            {index < data.length - 1 && <hr />}
          </div>
        ))
      ) : (
        <p>Click any point to know about it's info</p>
      )}
    </div>
  );
};

export default InfoBox;
