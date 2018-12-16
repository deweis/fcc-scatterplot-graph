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
