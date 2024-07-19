// src/components/ScatterPlot.js

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import InfoBox from './Infobox';


const ScatterPlot = ({ data, showPath }) => {
  const svgRef = useRef();
  const [selectedData, setSelectedData] = useState(null);

  const drawGraph = () => {
    const svg = d3.select(svgRef.current)
      .attr('width', '50vw')
      .attr('height', '40vh')
      .style('background', '#f0f0f0')
      .style('display', 'block')
      .style('margin', 'auto');

    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const width = parseFloat(svg.style('width')) - margin.left - margin.right;
    const height = parseFloat(svg.style('height')) - margin.top - margin.bottom;

    const xScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.x)])
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.y)])
      .range([height, 0]);

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    svg.selectAll('*').remove();

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(xAxis);

    g.append('g')
      .call(yAxis);

    g.selectAll('.point')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'point')
      .attr('cx', d => xScale(d.x))
      .attr('cy', d => yScale(d.y))
      .attr('r', 5)
      .attr('fill', 'blue')
      .style('cursor', 'pointer')
      .on('click', (event, d) => {
        setSelectedData(d);
      });

    if (showPath) {
      const lineGenerator = d3.line()
        .x(d => xScale(d.x))
        .y(d => yScale(d.y));

      g.append('path')
        .datum(data)
        .attr('d', lineGenerator)
        .attr('fill', 'none')
        .attr('stroke', 'red')
        .attr('stroke-width', 2);

      const arrowHead = svg.append('defs')
        .append('marker')
        .attr('id', 'arrowhead')
        .attr('viewBox', '-0 -5 10 10')
        .attr('refX', 5)
        .attr('refY', 0)
        .attr('orient', 'auto')
        .attr('markerWidth', 5)
        .attr('markerHeight', 5)
        .attr('xoverflow', 'visible')
        .append('svg:path')
        .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
        .attr('fill', '#e82020')
        .style('stroke', 'none');

      g.selectAll('.path-segment')
        .data(data.slice(1))
        .enter()
        .append('line')
        .attr('class', 'path-segment')
        .attr('x1', (d, i) => xScale(data[i].x))
        .attr('y1', (d, i) => yScale(data[i].y))
        .attr('x2', (d, i) => xScale(d.x))
        .attr('y2', (d, i) => yScale(d.y))
        .attr('stroke', '#e82020')
        .attr('stroke-width', 3)
        .attr('marker-end', 'url(#arrowhead)');

      g.selectAll('.point')
        .transition()
        .duration(1000)
        .attr('cx', (d, i) => xScale(data[i].x))
        .attr('cy', (d, i) => yScale(data[i].y));

      if (showPath) {
        g.selectAll('.label')
          .data(data)
          .enter()
          .append('text')
          .attr('class', 'label')
          .attr('x', d => xScale(d.x) + 5)
          .attr('y', d => yScale(d.y) - 5)
          .text((d, i) => i + 1)
          .attr('font-size', '15px')
          .attr('font-weight', 'bold')
          .attr('fill', '#000000');
      }
    }
  };

  useEffect(() => {
    drawGraph();
  }, [data, showPath]);

  useEffect(() => {
    const handleResize = () => {
      drawGraph();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [data, showPath]);

  return (
    <div>
      <svg ref={svgRef}></svg>
      <InfoBox data={selectedData} />
    </div>
  );
};

export default ScatterPlot;
