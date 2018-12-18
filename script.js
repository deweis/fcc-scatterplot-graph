/********** Fetch the data to be visualized **********/
fetch(
  'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json'
)
  .then(function(response) {
    return response.json();
  })
  .then(function(data) {
    updateChart(data);
  });

// Go through fCC Challenges and create chart in parallel
// Add 2nd color/dataset
// Add animation
// Make it responsive

/********** Create the chart *********/
function updateChart(data) {
  const dataset = data.map(x => [
    x.Year,
    Number(x.Year) / 100,
    x.Time,
    Number(x.Time.replace(':', '')) / 100
  ]);

  const w = 500;
  const h = 500;

  // Padding between the SVG canvas boundary and the plot
  const padding = 30;

  // Create an x and y scale
  const minX = d3.min(dataset, d => d[0]);
  const maxX = d3.max(dataset, d => d[0]);
  const minY = d3.min(dataset, d => d[3]);
  const maxY = d3.max(dataset, d => d[3]);

  const xScale = d3
    .scaleLinear()
    .domain([minX, maxX])
    .range([padding, w - padding]);

  const yScale = d3
    .scaleLinear()
    .domain([maxY, minY])
    .range([h - padding, padding]);

  // Add the SVG
  const svg = d3
    .select('#chartContainer')
    .append('svg')
    .attr('width', w)
    .attr('height', h);

  // Add the axes
  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);

  svg
    .append('g')
    .attr('id', 'x-axis')
    .attr('transform', 'translate(0,' + (h - padding) + ')')
    .call(xAxis);

  svg
    .append('g')
    .attr('transform', 'translate(' + padding + ',0)')
    .call(yAxis);

  // Add the data points
  svg
    .selectAll('circle')
    .data(dataset)
    .enter()
    .append('circle')
    .attr('cx', d => xScale(d[0]))
    .attr('cy', d => yScale(d[3]))
    .attr('r', 5);

  // Add the labels
  svg
    .selectAll('text')
    .data(dataset)
    .enter()
    .append('text')
    .text(d => `${d[0]}, ${d[2]}`)
    .attr('x', d => xScale(d[0]) + 10)
    .attr('y', d => yScale(d[3]));
}
