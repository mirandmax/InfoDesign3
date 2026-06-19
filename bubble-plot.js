// set the dimensions and margins of the graph
var marginBubble = { top: 30, right: 50, bottom: 40, left: 30 },
  widthBubble = 800 - marginBubble.left - marginBubble.right,
  heightBubble = 420 - marginBubble.top - marginBubble.bottom;

// append the svg object to the body of the page
const svg = d3.select("#bubble-plot")
  .append("svg")
  .lower()
  .attr("width", widthBubble + marginBubble.left + marginBubble.right)
  .attr("height", heightBubble + marginBubble.top + marginBubble.bottom)
  .append("g")
  .attr("transform", `translate(${marginBubble.left},${marginBubble.top})`);

function drawBubblePlot(data) {
  // Configuration constants
  const LEGEND_X_OFFSET = 0.85;
  const LEGEND_LABEL_OFFSET = 0.8;
  const BUBBLE_OPACITY_ACTIVE = 0.8;
  const BUBBLE_OPACITY_INACTIVE = 0.05;
  const LEGEND_SIZE = 20;
  const TRANSITION_DURATION = 300;

  // bubble opacity based on selection state
  const calculateBubbleOpacity = (d, activeContinents) => 
    activeContinents.size === 0 || activeContinents.has(d.continent) 
      ? BUBBLE_OPACITY_ACTIVE 
      : BUBBLE_OPACITY_INACTIVE;

  const calculateBubblePointerEvents = (d, activeContinents) =>
    activeContinents.size === 0 || activeContinents.has(d.continent)
      ? "all"
      : "none";

  const cleanData = data.filter(d => d.gini !== null && d.taxPct !== null && d.gdpPerCapita !== null);
  const years = cleanData.map(d => +d.year);
  const minYear = d3.min(years);
  const maxYear = 2023
  const slider = d3.select("#year-slider");
  const sliderTooltip = d3.select("#slider-tooltip");
  const sliderMinYear = d3.select("#slider-min-year");
  const sliderMaxYear = d3.select("#slider-max-year");
  const initialYear = Math.max(minYear, Math.min(maxYear, +slider.property("value") || maxYear));

  slider
    .attr("min", minYear)
    .attr("max", maxYear)
    .property("value", initialYear);
  sliderMinYear.text(minYear);
  sliderMaxYear.text(maxYear);

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
    .text("Tax Revenue(% of GDP)");

  const bubbleLayer = chartLayer.append("g").attr("class", "bubble-layer");

  const x = d3.scaleLinear().range([0, widthBubble]);
  const y = d3.scaleLinear().range([heightBubble, 0]);
  const z = d3.scaleLinear().range([2, 35]);

  // Add a scale for bubble color
  const myColor = d3.scaleOrdinal()
    .domain(["Asia", "Europe", "North America", "South America", "Africa", "Oceania"])
    .range(d3.schemeCategory10);

  //Tooltip
  //tooltip div, hidden by default
  const tooltip = d3.select("#bubble-plot")
    .append("div")
    .style("position", "absolute")
    .style("opacity", 0)
    .style("pointer-events", "none")
    .attr("class", "tooltip");

  const isTooltipAllowed = function (d, activeContinents = getActiveContinents()) {
    return activeContinents.size === 0 || activeContinents.has(d.continent);
  };

  let tooltipCountry = null;

  const showTooltip = function (event, d) {
    if (!isTooltipAllowed(d)) {
      return;
    }

    tooltipCountry = d;
    tooltip
      .transition()
      .duration(200)
    tooltip
      .style("opacity", 1)
      .html(`<strong>${d.country}</strong><br/>GDP per capita: $${(+d.gdpPerCapita).toLocaleString()}`)
      .style("left", (event.pageX + 10) + "px")
      .style("top", (event.pageY + 10) + "px")
  }
  const moveTooltip = function (event, d) {
    if (!isTooltipAllowed(d)) {
      return;
    }

    tooltip
      .style("left", (event.pageX + 10) + "px")
      .style("top", (event.pageY + 10) + "px")
  }
  const hideTooltip = function (event, d) {
    tooltipCountry = null;
    tooltip
      .style("opacity", 0)
  }

  //Highlight a group
  let selectedContinents = new Set();
  let hoveredContinent = null;
  let legendDots = null;
  let legendLabels = null;

  const getActiveContinents = function () {
    const activeContinents = new Set(selectedContinents);

    if (hoveredContinent) {
      activeContinents.add(hoveredContinent);
    }

    return activeContinents;
  };

  const updateHighlightState = function () {
    const activeContinents = getActiveContinents();

    d3.selectAll(".bubbles")
      .style("opacity", d => calculateBubbleOpacity(d, activeContinents));
    d3.selectAll(".bubbles")
      .style("pointer-events", d => calculateBubblePointerEvents(d, activeContinents));

    if (tooltipCountry && !isTooltipAllowed(tooltipCountry, activeContinents)) {
      hideTooltip();
    }

    if (legendDots && legendLabels) {
      legendDots.classed("is-active", d => selectedContinents.has(d));
      legendLabels.classed("is-active", d => selectedContinents.has(d));
    }
  };

  const highlight = function (event, d) {
    hoveredContinent = d;
    updateHighlightState();
  }

  const noHighlight = function (event, d) {
    if (hoveredContinent === d) {
      hoveredContinent = null;
    }
    updateHighlightState();
  }

  const toggleSelection = function (event, d) {
    if (selectedContinents.has(d)) {
      selectedContinents.delete(d);
    } else {
      selectedContinents.add(d);
    }
    updateHighlightState();
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
      .style("opacity", d => calculateBubbleOpacity(d, getActiveContinents()))
      .style("pointer-events", d => calculateBubblePointerEvents(d, getActiveContinents()))
      .on("mouseover", showTooltip)
      .on("mousemove", moveTooltip)
      .on("mouseleave", hideTooltip);

    const bubblesUpdate = bubblesEnter.merge(bubbles);

    bubblesUpdate
      .transition()
      .duration(TRANSITION_DURATION)
      .style("opacity", d => calculateBubbleOpacity(d, getActiveContinents()))
      .style("pointer-events", d => calculateBubblePointerEvents(d, getActiveContinents()))
      .attr("cx", d => x(d.gini))
      .attr("cy", d => y(d.taxPct))
      .attr("r", d => z(d.gdpPerCapita))
      .style("fill", d => myColor(d.continent));

    updateHighlightState();
  }

  function updateTooltipPosition() {
    const min = +slider.property("min");
    const max = +slider.property("max");
    const current = +slider.property("value");

    sliderTooltip.text(current);

    const percentage = (current - min) / (max - min);
    const thumbWidth = 16;
    const sliderNode = slider.node();
    const wrapperNode = sliderTooltip.node().parentElement;
    const sliderRect = sliderNode.getBoundingClientRect();
    const wrapperRect = wrapperNode.getBoundingClientRect();
    const sliderOffsetLeft = sliderRect.left - wrapperRect.left;
    const leftPosition = sliderOffsetLeft + percentage * (sliderRect.width - thumbWidth) + (thumbWidth / 2);

    sliderTooltip.style("left", `${leftPosition}px`);
  }

  slider.on("input", function () {
    updateTooltipPosition();
    update(+this.value);
    updateHighlightState();
  });

// initial domains for scales
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

  updateTooltipPosition();
  update(initialYear);


  //legend

  // Add one dot in the legend for each name.
  const allgroups = ["Asia", "Europe", "North America", "South America", "Africa", "Oceania"]
  legendDots = svg.selectAll(".legend-dot")
    .data(allgroups)
    .join("circle")
    .attr("class", "legend-dot")
    .attr("cx", widthBubble * LEGEND_X_OFFSET)
    .attr("cy", (d, i) => 10 + i * (LEGEND_SIZE + 5))
    .attr("r", 7)
    .style("fill", d => myColor(d))
    .on("mouseover", highlight)
    .on("mouseleave", noHighlight)
    .on("click", toggleSelection)

  // Add labels beside legend dots
  legendLabels = svg.selectAll(".legend-label")
    .data(allgroups)
    .join("text")
    .attr("class", "legend-label")
    .attr("x", widthBubble * LEGEND_X_OFFSET + LEGEND_SIZE * LEGEND_LABEL_OFFSET)
    .attr("y", (d, i) => i * (LEGEND_SIZE + 5) + (LEGEND_SIZE / 2))
    .style("fill", d => myColor(d))
    .text(d => d)
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle")
    .on("mouseover", highlight)
    .on("mouseleave", noHighlight)
    .on("click", toggleSelection)

  updateHighlightState();

}