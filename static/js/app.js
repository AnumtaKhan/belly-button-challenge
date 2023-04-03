// Assign constant variable to the url
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// Fetch JSON data and console log it
d3.json(url).then(function(data) {
    console.log(data);
});

// Initialize dashboard
function init() {

    // Select the dropdown menu
    let DropDownMenu = d3.select("#selDataset");

    // Get sample names and populate drop-down selector
    d3.json(url).then((data) => {
        
        // Set a variable for sample names
        let SampleNames = data.names;

        // Add the samples to dropdown menu
        SampleNames.forEach((id) => {

            // Log the value of id
            console.log(id);

            DropDownMenu.append("option")
            .text(id)
            .property("value", id);
        });

        // Set first sample
        let sampleOne = SampleNames[0];

        // Log the value of sample1
        console.log(sampleOne);

        // Build the initial plots
        buildMetadata(sampleOne);
        buildBarChart(sampleOne);
        buildBubbleChart(sampleOne);

    });
};

// Build a bar chart
function buildBarChart(sample) {

    // Retrieve all of the data using D3
    d3.json(url).then((data) => {

        // Retrieve all sample data
        let sampledata = data.samples;

        // Filter based on the value of sample
        let ValueofSample = sampledata.filter(result => result.id == sample);

        // Get the first index from the array
        let valueData = ValueofSample[0];

        // Get otu_ids, lables & sample values
        let otu_ids = valueData.otu_ids;
        let otu_labels = valueData.otu_labels;
        let sample_values = valueData.sample_values;

        // Log the data to the console
        console.log(otu_ids, otu_labels, sample_values);

        // Set the top ten items to display (descending order)
        let yticks = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();
        let xticks = sample_values.slice(0,10).reverse();
        let labels = otu_labels.slice(0,10).reverse();
        
        // Set up the trace for the bar chart
        let trace1 = {
            x: xticks,
            y: yticks,
            text: labels,
            type: "bar",
            orientation: "h"
        };

        // Setup the layout
        let layout = {
            title: "Top 10 OTUs found"
        };

        // Plot the bar chart using Plotly
        Plotly.newPlot("bar", [trace1], layout)
    });
};

// Build a bubble chart
function buildBubbleChart(sample) {

    // Retrieve all of the data using D3
    d3.json(url).then((data) => {
        
        // Retrieve all sample data
        let sampledata = data.samples;

        // Filter based on the value of sample
        let ValueofSample = sampledata.filter(result => result.id == sample);

        // Get the first index from the array
        let valueData = ValueofSample[0];

        // Get otu_ids, lables & sample values
        let otu_ids = valueData.otu_ids;
        let otu_labels = valueData.otu_labels;
        let sample_values = valueData.sample_values;

        // Log the data to the console
        console.log(otu_ids, otu_labels, sample_values);
        
        // Set up the trace for bubble chart
        let trace2 = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
            }
        };

        // Set up the layout
        let layout = {
            title: "Bacteria Per Sample",
            hovermode: "closest",
            xaxis: {title: "OTU ID"},
            yaxis: {title: "Sample Values"},
        };

        // Plot the bubble chart using Plotly
        Plotly.newPlot("bubble", [trace2], layout)
    });
};

// Populate metadata info
function buildMetadata(sample) {

    // Retrieve all of the data using D3
    d3.json(url).then((data) => {

        // Retrieve all Metadata
        let Metadata = data.metadata;

        // Filter based on the value of sample
        let ValueofSample = Metadata.filter(result => result.id == sample);

        // Log the array of metadata objects after the have been filtered
        console.log(ValueofSample)

        // Get the first index from the array
        let valueData = ValueofSample[0];

        // Clear out Metadata
        d3.select("#sample-Metadata").html("");

        // Add each value pair to the panel
        Object.entries(valueData).forEach(([key, ValueofSample]) => {

            // Log the individual pairs to the Metadata panel
            console.log(key, ValueofSample);

            d3.select("#sample-Metadata").append("h5").text(`${key}: ${ValueofSample}`);
        });
    });

};

// Update the dashboard when sample is changed
function optionChanged(ValueofSample) { 

    // Log new value
    console.log(ValueofSample); 

    // Call all functions 
    buildMetadata(ValueofSample);
    buildBarChart(ValueofSample);
    buildBubbleChart(ValueofSample);
};

// Call the initialize function
init();