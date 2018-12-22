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

// Add scale description
// Put to codepen and solve challenge

/********** Create the chart *********/
function updateChart(data) {
  const dataset = data.map(x => [
    x.Year,
    new Date(-3600000 + x.Seconds * 1000),
    x.Doping,
    x.Name,
    x.Nationality
  ]);

  const w = 600;
  const h = 600;

  /* Padding between the SVG canvas boundary and the plot */
  const padding = 35;

  /* Create an x and y scale */
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

  /* Add the SVG */
  const svg = d3
    .select('#chartContainer')
    .append('svg')
    .attr('id', 'chart')
    .attr('width', w)
    .attr('height', h)
    /*
      Make it responsive
        Thank you: https://stackoverflow.com/a/9539361 resp. http://jsfiddle.net/shawnbot/BJLe6/
    */
    .attr('viewBox', `0 0 ${w} ${h}`)
    .attr('preserveAspectRatio', 'xMidYMid');

  /* Add the axes */
  const xAxis = d3.axisBottom(xScale).tickFormat(d3.format('')); // format years as string
  const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat('%M:%S'));

  svg
    .append('g')
    .attr('id', 'x-axis')
    .attr('class', 'axis')
    .attr('transform', `translate(${padding}, ${h - padding})`)
    .call(xAxis);

  svg
    .append('g')
    .attr('id', 'y-axis')
    .attr('class', 'axis')
    .attr('transform', `translate(${padding}, 0)`)
    .call(yAxis);

  /* Add the data points */
  svg
    .selectAll('circle')
    .data(dataset)
    .enter()
    .append('circle')
    /* Add the transition 
       thank you: https://codepen.io/HIC/full/JaaEOa/*/
    .transition()
    .duration(0)
    .delay((d, i) => i * 80)
    .attr('cx', d => padding + xScale(d[0]))
    .attr('cy', d => yScale(d[1]))
    .attr('r', 5)
    .attr('class', 'dot')
    .attr('fill', d => (d[2] === '' ? '#81c784' : '#e57373')) //  Doping: No: green lighten-2 / Yes: red lighten-2
    .attr('data-xvalue', d => d[0])
    .attr('data-yvalue', d => d[1]);

  /* Add the legends */
  svg
    .append('rect')
    .attr('x', w - 150)
    .attr('y', h - h + 50)
    .attr('width', 10)
    .attr('height', 10)
    .style('fill', '#81c784'); // green lighten-2

  svg
    .append('text')
    .attr('x', w - 135)
    .attr('y', h - h + 60)
    .attr('id', 'legend')
    .attr('class', 'legend')
    .attr('width', 50)
    .attr('height', 50)
    .style('fill', '#757575') // grey darken-1
    .text('No Doping allegations');

  svg
    .append('rect')
    .attr('x', w - 150)
    .attr('y', 65)
    .attr('width', 10)
    .attr('height', 10)
    .style('fill', '#e57373'); // red lighten-2

  svg
    .append('text')
    .attr('x', w - 135)
    .attr('y', 75)
    .attr('class', 'legend')
    .attr('width', 50)
    .attr('height', 50)
    .style('fill', '#757575') // grey darken-1
    .text('With Doping allegations');

  /* Define the div for the tooltip 
Thank you: http://bl.ocks.org/d3noob/a22c42db65eb00d4e369  */
  const divTooltip = d3
    .select('body')
    .append('div')
    .attr('class', 'tooltip')
    .attr('id', 'tooltip')
    .style('opacity', 0);

  /* Show the tooltip when hovering */
  svg
    .selectAll('circle')
    .on('mouseover', d => {
      const formatTime = d3.timeFormat('%M:%S');
      const doped = d[2] === '' ? '' : `<br><br>${d[2]}`;
      const well =
        d[2] === '' ? '<br><br>Well, seems he had a good doctor..😉' : '';

      divTooltip
        .transition()
        .duration(200)
        .style('opacity', 0.9)
        .attr('data-year', d[0]);

      divTooltip
        .html(
          `
          ${d[3]}: ${d[4]}<br>
          Year: ${d[0]},  Time: ${formatTime(d[1])}
          ${doped}
          ${well}
          `
        )
        .style('left', d3.event.pageX + 10 + 'px')
        .style('top', d3.event.pageY - 35 + 'px')
        .style('background', doped ? '#ffcdd2' : '#c8e6c9'); //  Doping: Yes: red lighten-4 / No: green lighten-4
    })
    .on('mouseout', d => {
      /* Hide the tooltip when hovering out */
      divTooltip
        .transition()
        .duration(500)
        .style('opacity', 0);
    });
}

/*
  Make it responsive
    Thank you: https://stackoverflow.com/a/9539361 resp. http://jsfiddle.net/shawnbot/BJLe6/
*/
$(function() {
  const chart = $('#chart'),
    aspect = chart.width() / chart.height(),
    container = chart.parent();

  /* Set inital widgth/height based on browser width */
  let targetWidth = container.width() > 600 ? 600 : container.width();
  chart.attr('width', targetWidth);
  chart.attr('height', Math.round(targetWidth / aspect));

  /* Adjust size if window is being resized */
  $(window)
    .on('resize', function() {
      targetWidth = container.width() > 600 ? 600 : container.width();
      chart.attr('width', targetWidth);
      chart.attr('height', Math.round(targetWidth / aspect));
    })
    .trigger('resize');
});
