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

// Add 2nd color/dataset
// Add animation
// Make it responsive

/********** Create the chart *********/
function updateChart(data) {
  const dataset = data.map(x => [
    x.Year,
    new Date(-3600000 + x.Seconds * 1000)
  ]);

  const w = 500;
  const h = 500;

  // Padding between the SVG canvas boundary and the plot
  const padding = 35;

  // Create an x and y scale
  const minX = d3.min(dataset, d => d[0] - 1);
  const maxX = d3.max(dataset, d => d[0] + 1);
  const minY = d3.min(dataset, d => d[1]);
  const maxY = d3.max(dataset, d => d[1]);

  const xScale = d3
    .scaleLinear()
    .domain([minX, maxX])
    .range([0, w - 1.5 * padding]);

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
  const xAxis = d3.axisBottom(xScale).tickFormat(d3.format('')); // format years as string
  const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat('%M:%S'));

  svg
    .append('g')
    .attr('id', 'x-axis')
    .attr('transform', `translate(${padding}, ${h - padding})`)
    .call(xAxis);

  svg
    .append('g')
    .attr('id', 'y-axis')
    .attr('transform', `translate(${padding}, 0)`)
    .call(yAxis);

  // Add the data points
  svg
    .selectAll('circle')
    .data(dataset)
    .enter()
    .append('circle')
    .attr('class', 'dot')
    .attr('data-xvalue', d => d[0])
    .attr('data-yvalue', d => d[1])
    .attr('cx', d => padding + xScale(d[0]))
    .attr('cy', d => yScale(d[1]))
    .attr('r', 5);
}
