console.log("Testing");
function buildMetadata(sample) {
    var url = `/metadata/${sample}`;
    
    d3.json(url).then((metaData)=>{
        var panel = d3.select("#sample-metadata");
        panel.html("");

        Object.entries(metaData).forEach(([key,value])=>{
            var paragraph = panel.append("p");
            paragraph.text(`${key}: ${value}`);
        });

    });
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var pieSelector = d3.select("#pie")
  var bubbleSelector = d3.select("#bubble")
  var gaugeSelecor = d3.select("#gauge")
  var url = `/samples/${sample}`;
  var urlGauge = `/wfreq/${sample}`;
 
  d3.json(url).then((sampleData) => {
    var sampleValues = sampleData.sample_values;
    var sampleLabels = sampleData.otu_ids;
    var hoverText = sampleData.otu_labels;

    var piePlot = {
      labels: sampleLabels.slice(0,9),
      values: sampleValues.slice(0,9),
      type: 'pie',
      hovertext: hoverText.slice(0,9)

    
    };

    var piedata = [piePlot];
    var pielayout = {
      title: "Top Ten Samples"
    };

    var bubblePlot = {
        x:  sampleLabels,
        y: sampleValues,
        mode: 'markers',
        text: hoverText,
        marker: {
          color: sampleLabels,
          size: sampleValues
          
        },
        type: 'scatter'
      };

      var bubbledata = [bubblePlot];
      var bubblelayout = {
        title: "OTU Samples"
      };
    
      

    Plotly.newPlot("pie", piedata, pielayout);
    Plotly.newPlot("bubble", bubbledata, bubblelayout);
   
  });
  console.log(urlGauge);

  d3.json(urlGauge).then((wfreqData)=>{
        // Enter a speed between 0 and 9
        var level = wfreqData * 20;
        // Trig to calc meter point
        var degrees = 180 - level,
        radius = .5;
        var radians = degrees * Math.PI / 180;
        var x = radius * Math.cos(radians);
        var y = radius * Math.sin(radians);
    
        // Path: may have to change to create a better triangle
        var mainPath = 'M -.0 -0.05 L .0 0.05 L ',
        pathX = String(x),
        space = ' ',
        pathY = String(y),
        pathEnd = ' Z';
        var path = mainPath.concat(pathX,space,pathY,pathEnd);

        var gaugePlot = [{ type: 'scatter', x: [0], y:[0],
       marker: {size: 12, color:'850000'},
       showlegend: false,
       name: 'frequency',
       text: level,
       hoverinfo: 'text+name'},
      { values: [50/9, 50/9, 50/9, 50/9, 50/9, 50/9,50/9,50/9,50/9,50],
      rotation: 90,
      text: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1', ''],
      textinfo: 'text',
      textposition:'inside',
      marker: {colors:[
        'rgba(0, 105, 11, .5)', 'rgba(10, 120, 22, .5)',
        'rgba(14, 127, 0, .5)', 'rgba(110, 154, 22, .5)',
        'rgba(170, 202, 42, .5)', 'rgba(202, 209, 95, .5)',
        'rgba(210, 206, 145, .5)', 'rgba(232, 226, 202, .5)',
        'rgba(240, 230, 215, .5)', 'rgba(255, 255, 255, 0)']},
      labels: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1', ''],
      hoverinfo: 'label',
      hole: .5,
      type: 'pie',
      showlegend: false
    }];

       var gaugeData = [gaugePlot];
       var gaugeLayout = {
        shapes:[{
          type: 'path',
          path: path,
          fillcolor: '850000',
          line: {
            color: '850000'
          }
        }],
      title: 'Belly Button Washing Frequency(per Week)',
      height: 600,
      width: 600,
      xaxis: {zeroline:false, showticklabels:false,
                showgrid: false, range: [-1, 1]},
      yaxis: {zeroline:false, showticklabels:false,
                showgrid: false, range: [-1, 1]}
      };


    Plotly.newPlot("gauge", gaugePlot, gaugeLayout);




  });

}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");
    d3.json("/names").then((sampleNames) => {
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(`BB_${sample}`)
          .property("value", sample);
      });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();