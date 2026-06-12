// set the dimensions and margins of the graph
var marginBubble = { top: 30, right: 150, bottom: 40, left: 50 },
  widthBubble = 900 - marginBubble.left - marginBubble.right,
  heightBubble = 420 - marginBubble.top - marginBubble.bottom;

// append the svg object to the body of the page
const svg = d3.select("#bubble-plot")
  .append("svg")
  .attr("width", widthBubble + marginBubble.left + marginBubble.right)
  .attr("height", heightBubble + marginBubble.top + marginBubble.bottom)
  .append("g")
  .attr("transform", `translate(${marginBubble.left},${marginBubble.top})`);

//Read the data
//d3.csv("data/tax-revenues-vs-income-inequality/tax-revenues-vs-income-inequality.csv").then(function (data) {
function drawBubblePlot(data) {
  const cleanData = data.filter(d => d.gini !== null && d.taxPct !== null && d.population !== null && d.gdpPerCapita !== null);
  const years = cleanData.map(d => +d.year);
  const minYear = d3.min(years);
  const maxYear = d3.max(years);
  const slider = d3.select("#year-slider");
  const initialYear = Math.max(minYear, Math.min(maxYear, +slider.property("value") || maxYear));


  slider
    .attr("min", minYear)
    .attr("max", maxYear)
    .property("value", initialYear);

  const chartLayer = svg.append("g").attr("class", "bubble-chart");
  const xAxis = chartLayer.append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0, ${heightBubble})`);
  const yAxis = chartLayer.append("g")
    .attr("class", "y-axis");

  chartLayer.append("text")
    .attr("class", "x-axis-label")
    .attr("text-anchor", "end")
    .attr("x", widthBubble)
    .attr("y", heightBubble + marginBubble.top + 10)
    .text("Gini Coefficient");

  chartLayer.append("text")
    .attr("class", "y-axis-label")
    .attr("text-anchor", "start")
    .attr("x", -10)
    .attr("y", -10)
    .text("Tax Revenue");

  const bubbleLayer = chartLayer.append("g").attr("class", "bubble-layer");

  const x = d3.scaleLinear().range([0, widthBubble]);
  const y = d3.scaleLinear().range([heightBubble, 0]);
  const z = d3.scaleLinear().range([2, 35]);

  // Add a scale for bubble color
  var myColor = d3.scaleOrdinal()
    .domain(["Asia", "Europe", "North America", "South America", "Africa", "Oceania"])
    .range(d3.schemeSet1);


  //Tooltip

  // Create a tooltip div that is hidden by default:
  const tooltip = d3.select("body")
    .append("div")
    .style("position", "absolute")
    .style("opacity", 0)
    .attr("class", "tooltip");

  //Create 3 functions to show / update (when mouse move but stay on same circle) / hide the tooltip
  const showTooltip = function (event, d) {
    console.log(event, d);
    tooltip
      .transition()
      .duration(200)
    tooltip
      .style("opacity", 1)
      .html(d.country)
      .style("left", (event.pageX + 10) + "px")
      .style("top", (event.pageY + 10) + "px")
  }
  const moveTooltip = function (event, d) {
    tooltip
      .style("left", (event.pageX + 10) + "px")
      .style("top", (event.pageY + 10) + "px")
  }
  const hideTooltip = function (event, d) {
    tooltip
      .style("opacity", 0)
  }

  //Highlight a group
  const highlight = function (event, d) {
    // reduce opacity of all groups
    d3.selectAll(".bubbles").style("opacity", .05)
    // expect the one that is hovered
    d3.selectAll("." + d.replace(/\s/g, '')).style("opacity", 1)
  }

  // And when it is not hovered anymore
  const noHighlight = function (event, d) {
    d3.selectAll(".bubbles").style("opacity", 1)
  }

  function update(selectedYear) {
    const filteredData = cleanData.filter(d => +d.year === +selectedYear);

    const bubbles = bubbleLayer.selectAll("circle")
      .data(filteredData, d => d.country);

    bubbles.exit()
      .transition()
      .duration(200)
      .style("opacity", 0)
      .remove();

    const bubblesEnter = bubbles.enter()
      .append("circle")
      .attr("class", d => "bubbles " + d.continent.replace(/\s/g, ''))
      .attr("cx", d => x(d.gini))
      .attr("cy", d => y(d.taxPct))
      .attr("r", d => z(d.gdpPerCapita))
      .style("fill", d => myColor(d.continent))
      .style("opacity", 1)
      .on("mouseover", showTooltip)
      .on("mousemove", moveTooltip)
      .on("mouseleave", hideTooltip);

    const bubblesUpdate = bubblesEnter.merge(bubbles);

    bubblesUpdate
    .transition()
    .duration(300)
    .style("opacity", 1)
      .attr("cx", d => x(d.gini))
      .attr("cy", d => y(d.taxPct))
      .attr("r", d => z(d.gdpPerCapita))
      .style("fill", d => myColor(d.continent));
  }

  slider.on("input", function () {
    update(+this.value);
  });


  const xmin = d3.min(cleanData, d => d.gini);
  const xmax = d3.max(cleanData, d => d.gini);
  const ymax = d3.max(cleanData, d => d.taxPct);
  const rmin = d3.min(cleanData, d => d.gdpPerCapita);
  const rmax = d3.max(cleanData, d => d.gdpPerCapita);

  x.domain([xmin * 0.9, xmax * 1.1]);
  y.domain([0, ymax * 1.1]);
  z.domain([rmin, rmax]);

  xAxis.transition().duration(500).call(d3.axisBottom(x));
  yAxis.transition().duration(500).call(d3.axisLeft(y));

  update(initialYear);


  //legend

  // Add one dot in the legend for each name.
  const size = 20
  const allgroups = ["Asia", "Europe", "North America", "South America", "Africa", "Oceania"]
  svg.selectAll("myrect")
    .data(allgroups)
    .join("circle")
    .attr("cx", widthBubble * 0.9)
    .attr("cy", (d, i) => 10 + i * (size + 5))
    .attr("r", 7)
    .style("fill", d => myColor(d))
    .on("mouseover", highlight)
    .on("mouseleave", noHighlight)

  // Add labels beside legend dots
  svg.selectAll("mylabels")
    .data(allgroups)
    .enter()
    .append("text")
    .attr("x", widthBubble * 0.9 + size * .8)
    .attr("y", (d, i) => i * (size + 5) + (size / 2))
    .style("fill", d => myColor(d))
    .text(d => d)
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle")
    .on("mouseover", highlight)
    .on("mouseleave", noHighlight)

}