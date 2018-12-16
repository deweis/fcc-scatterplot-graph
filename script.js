/********** Fetch the data to be visualized **********/
fetch(
  'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json'
)
  .then(function(response) {
    return response.json();
  })
  .then(function(data) {
    console.log(data);
  });

// Go through fCC Challenges and create chart in parallel
// Add 2nd color/dataset
// Add animation
// Make it responsive
