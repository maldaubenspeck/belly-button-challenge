//Use the D3 library to get the data from samples.json
const url = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json'
// initialize the dashboard
d3.json(url).then(function(data){
    console.log(data);
});
const dataPromise = d3.json(url);
console.log("Data Promise: ", dataPromise);
dataPromise.then(data => {
    // Select the dropdown menu for sample selection
    var selector = d3.select("#selDataset");
    // Get all the sample names from the data
    var sampleNames = data.names;
    // Add the sample names to the dropdown menu options
    sampleNames.forEach(sample => {
        selector
            .append("option")
            .text(sample)
            .property("value", sample);
    });
    // Set the first sample name as the initial sample displayed on the dashboard
    var initialSample = sampleNames[0];
    // Show information and charts for the initial sample
    buildMetadata(initialSample, data);
    buildCharts(initialSample, data);
});
function optionChanged(newSample) {
    // Update the information and charts for the new sample
    dataPromise.then(data => {
        buildMetadata(newSample, data);
        buildCharts(newSample, data);
    });
}
function buildMetadata(sample, data) {
    // Get the metadata for all samples
    var metadata = data.metadata;
    // Filter the metadata to only include the selected sample
    var metadataArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var selectedSample = metadataArray[0];
    var PANEL = d3.select("#sample-metadata");
    // Clear the previous demographic information
    PANEL.html("");
    // Show the demographic information for the selected sample
    Object.entries(selectedSample).forEach(([key, value]) => {
        PANEL.append("h6").text(`${key}: ${value}`);
    });
}
// Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual
function buildCharts(sample, data) {
    // Get all the sample data
    var samples = data.samples;
    // Filter the sample data to only include the selected sample
    var sampleArray = samples.filter(sampleObj => sampleObj.id == sample);
    // Filter the metadata data to only include the selected sample
    var metadataArray = data.metadata.filter(sampleObj => sampleObj.id == sample);
    var selectedSample = sampleArray[0];
    // Get the data for the selected sample
    var otu_ids = selectedSample.otu_ids;
    var otu_labels = selectedSample.otu_labels;
    var sample_values = selectedSample.sample_values;
    var wfreq = metadataArray[0].wfreq;
    // Code for Bar Chart
      // Create y labels and use the slice function to only get the top 10
      var yticks = otu_ids.slice(0,10).map(outId => `OTU ${outId}`).reverse();
      // Reverse the x axis to ensure the bar chart has biggest on top down
      var barData = [{
          x: sample_values.slice(0,10).reverse(),
          y: yticks,
          type: "bar",
          orientation: "h",
          text: otu_labels.slice(0,10),
      }];
      // Create the bar chart
      Plotly.newPlot("bar", barData);
// Create a bubble chart that displays each sample
var bubbleData = [{
    x: otu_ids,
    y: sample_values,
    mode: "markers",
    marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: "Electric"
    },
    text: otu_labels
}];
var bubbleLayout = {
    xaxis: {title: "OTU ID"}
};
Plotly.newPlot("bubble", bubbleData, bubbleLayout);
}
