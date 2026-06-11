// set the dimensions and margins of the graph
var margin = { top: 10, right: 150, bottom: 30, left: 50 },
  width = 700 - margin.left - margin.right,
  height = 420 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("#bubble-plot")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

//Read the data
//d3.csv("data/tax-revenues-vs-income-inequality/tax-revenues-vs-income-inequality.csv").then(function (data) {
function drawBubblePlot(data) {
  data = data.filter(d => d.gini !== null && d.taxPct !== null && d.population !== null);

  currentYear = 2021;
  data = data.filter(d => +d.year === currentYear);

  xmax = d3.max(data, d => d.gini);
  ymax = d3.max(data, d => d.taxPct);
  rmin = d3.min(data, d => d.population);
  rmax = d3.max(data, d => d.population);
  
  console.log(data.filter(d  => d.continent === "Asia"));

  // Add X axis
  const x = d3.scaleLinear()
    .domain([0, xmax * 1.1])
    .range([0, width]);
  svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x));

  // Add Y axis
  const y = d3.scaleLinear()
    .domain([0, ymax * 1.1])
    .range([height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y));


  // Add a scale for bubble size
  const z = d3.scaleLinear()
    .domain([rmin, rmax])
    .range([2, 35]);

  // Add a scale for bubble color
  var myColor = d3.scaleOrdinal()
    .domain(["Asia", "Europe", "North America", "South America", "Africa", "Oceania"])
    .range(d3.schemeSet1);


  //Tooltip

  // Create a tooltip div that is hidden by default:
  const tooltip = d3.select("#bubble-plot")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "black")
    .style("border-radius", "5px")
    .style("padding", "10px")
    .style("color", "white")

  //Create 3 functions to show / update (when mouse move but stay on same circle) / hide the tooltip
  const showTooltip = function (event, d) {
    console.log(event, d);
    tooltip
      .transition()
      .duration(200)
    tooltip
      .style("opacity", 1)
      .html("Country: " + d.country)
      .style("left", (event.x) / 2 + "px")
      .style("top", (event.y) / 2 - 50 + "px")
  }
  const moveTooltip = function (event, d) {
    tooltip
      .style("left", (event.x) / 2 + "px")
      .style("top", (event.y) / 2 - 50 + "px")
  }
  const hideTooltip = function (event, d) {
    tooltip
      .transition()
      .duration(200)
      .style("opacity", 0)
  }

  //Highlight a group
  const highlight = function (event, d) {
    // reduce opacity of all groups
    console.log(d);
    d3.selectAll(".bubbles").style("opacity", .05)
    // expect the one that is hovered
    d3.selectAll("." + d.replace(/\s/g, '')).style("opacity", 1)
  }

  // And when it is not hovered anymore
  const noHighlight = function (event, d) {
    d3.selectAll(".bubbles").style("opacity", 1)
  }

  // Add dots
  svg.append('g')
    .selectAll("dot")
    .data(data)
    .join("circle")
    .attr("class", function (d) { return "bubbles " + d.continent.replace(/\s/g, '') })
    .attr("cx", d => x(d.gini))
    .attr("cy", d => y(d.taxPct))
    .attr("r", d => z(d.population))
    .style("fill", d => myColor(d.continent))
    //.style("opacity", "0.7")
    //.attr("stroke", "black")
    .on("mouseover", showTooltip)
    .on("mousemove", moveTooltip)
    .on("mouseleave", hideTooltip)


  //legend
  // Add legend: circles


  // Add one dot in the legend for each name.
  const size = 20
  const allgroups = ["Asia", "Europe", "North America", "South America", "Africa", "Oceania"]
  svg.selectAll("myrect")
    .data(allgroups)
    .join("circle")
    .attr("cx", width)
    .attr("cy", (d, i) => 10 + i * (size + 5)) // 100 is where the first dot appears. 25 is the distance between dots
    .attr("r", 7)
    .style("fill", d => myColor(d))
    .on("mouseover", highlight)
    .on("mouseleave", noHighlight)

  // Add labels beside legend dots
  svg.selectAll("mylabels")
    .data(allgroups)
    .enter()
    .append("text")
    .attr("x", width + size * .8)
    .attr("y", (d, i) => i * (size + 5) + (size / 2)) // 100 is where the first dot appears. 25 is the distance between dots
    .style("fill", d => myColor(d))
    .text(d => d)
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle")
    .on("mouseover", highlight)
    .on("mouseleave", noHighlight)

}