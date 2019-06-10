// @TODO: YOUR CODE HERE!

var svgWidth = 960;
var svgHeight = 600;

// Set svg margins 
var margin = {
  top: 30,
  right: 30,
  bottom: 80,
  left: 80
};


var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);


var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
var file = "assets/data/data.csv"


d3.csv(file).then(successHandle, errorHandle);

function errorHandle(error) {
  throw err;
}

function successHandle(statesData) {

  // Loop 
  statesData.map(function (data) {
    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;
  });

  // Set scale
    var xLinearScale = d3.scaleLinear()
    .domain([8.1, d3.max(statesData, d => d.poverty)])
    .range([0, width]);

  var yLinearScale = d3.scaleLinear()
    .domain([1.0, d3.max(statesData, d => d.healthcare)])
    .range([height, 0]);

  

  var bottomAxis = d3.axisBottom(xLinearScale) 
    .ticks(8);
  var leftAxis = d3.axisLeft(yLinearScale);


 
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);
  
  chartGroup.append("g")
    .call(leftAxis);


  // Create Circle for scatter plot
  var circlesGroup = chartGroup.selectAll("circle")
    .data(statesData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "13")
    .attr("fill", "#788dc2")
    .attr("opacity", ".75")


 

  var circlesGroup = chartGroup.selectAll()
    .data(statesData)
    .enter()
    .append("text")
    .attr("x", d => xLinearScale(d.poverty))
    .attr("y", d => yLinearScale(d.healthcare))
    .style("font-size", "13px")
    .style("text-anchor", "middle")
    .style('fill', 'white')
    .text(d => (d.abbr));

  // tool tip
  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function (d) {
      return (`${d.state}<br>Poverty: ${d.poverty}%<br>Healthcare: ${d.healthcare}% `);
    });

 
  chartGroup.call(toolTip);

  // event listeners
    circlesGroup.on("mouseover", function (data) {
    toolTip.show(data, this);
  })
    
    .on("mouseout", function (data) {
      toolTip.hide(data);
    });

  // Create axes labels
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 30)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Lacks Healthcare (%)");

  chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 20})`)
    .attr("class", "axisText")
    .text("In Poverty (%)");
}
