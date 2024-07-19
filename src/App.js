// src/App.js
import React, { useState, useEffect } from 'react';
import ScatterPlot from './ScatterPlot';
import Navbar from './Navbar';
import "./App.css";
import * as d3 from 'd3-fetch';

const App = () => {
  const [data, setData] = useState([]);
  const [showPath, setShowPath] = useState(false);

  useEffect(() => {
    const processData = (data) => {
      const groupedData = data.reduce((acc, d) => {
        // Skip empty rows or rows without a timeline
        if (!d.Timeline || !d.x || !d.y) return acc;
        
        const key = `${d.x},${d.y}`;
        if (!acc[key]) {
          acc[key] = { x: +d.x, y: +d.y, values: [] };
        }
        acc[key].values.push({
          type: d.type,
          title: d['Title for resource'] || d['summary headline'],
          href: d.href,
          timeline: d.Timeline,
          summaryDescription: d['summary description'],
        });
        return acc;
      }, {});

      const finalData = Object.values(groupedData).map(group => {
        group.values = group.values.filter(item => item.timeline); // Remove items without timeline
        group.values.sort((a, b) => new Date(a.timeline) - new Date(b.timeline));
        return group;
      });

      return finalData.sort((a, b) => {
        const lastA = a.values[a.values.length - 1];
        const lastB = b.values[b.values.length - 1];
        return new Date(lastA.timeline) - new Date(lastB.timeline);
      });
    };

    d3.csv('/timelineTask(Sheet1).csv')
      .then(rawData => {
        const processedData = processData(rawData);
        setData(processedData);
      })
      .catch(error => {
        console.error('Error loading or parsing CSV file:', error);
      });
  }, []);

  return (
    <div className='App'>
      <Navbar />
      <button onClick={() => setShowPath(!showPath)}>Show my learning Path</button>
      <ScatterPlot data={data} showPath={showPath} />
    </div>
  );
};

export default App;
