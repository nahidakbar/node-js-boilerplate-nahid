"use strict";

const fs = require('fs');

// based on http://odino.org/generating-badges-slash-shields-with-nodejs/
module.exports = function (left, category, output)
{
  let right = null;
  let color = 'red';
  if (typeof category === 'object')
  {
    let percentage = category.covered / category.total * 100;
    right = Math.floor(percentage) + '%';
    if (category.total === 0)
    {
      right = '100%';
      percentage = 100;
    }
    
    if (percentage > 80)
    {
      color = 'green';
    }
    else if (percentage > 50)
    {
      color = 'gray';
    }
  }
  else
  {
    right = category;
    color = 'green';
  }

  let leftWidth = left.length * 9 + 8;
  let rightWidth = right.length * 9 + 8;
  let totalWidth = leftWidth + rightWidth;

  fs.writeFileSync(output, `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="20">
  <linearGradient id="smooth" x2="0" y2="100%">
    <stop offset="0"  stop-color="#fff" stop-opacity=".7"/>
    <stop offset=".1" stop-color="#aaa" stop-opacity=".1"/>
    <stop offset=".9" stop-color="#000" stop-opacity=".3"/>
    <stop offset="1"  stop-color="#000" stop-opacity=".5"/>
  </linearGradient>

  <mask id="round">
    <rect width="${totalWidth}" height="20" rx="4" fill="#fff"/>
  </mask>

  <g mask="url(#round)">
    <rect width="${leftWidth}" height="20" fill="#555"/>
    <rect x="${leftWidth}" width="${rightWidth}" height="20" fill="${color}"/>
    <rect width="${totalWidth}" height="20" fill="url(#smooth)"/>
  </g>

  <g fill="#fff" text-anchor="middle" font-family="Lucida Console,Monaco,monospace" font-size="12">
    <text x="${leftWidth /2}" y="14" fill="#010101" fill-opacity=".3">${left}</text>
    <text x="${leftWidth /2}" y="13">${left}</text>
    <text x="${leftWidth + rightWidth /2}" y="14" fill="#010101" fill-opacity=".3">${right}</text>
    <text x="${leftWidth + rightWidth /2}" y="13">${right}</text>
  </g>
</svg>`);
}
