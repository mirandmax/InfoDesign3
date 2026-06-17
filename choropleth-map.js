var tooltip;

function mouseOver(event, country) {
  d3.selectAll(".Country").transition().duration(200).style("opacity", 0.5);
  d3.select(this)
    .transition()
    .duration(200)
    .style("opacity", 1)
    .style("stroke", "black")
    .style("stroke-width", 2);
  
  document.getElementById("tooltip").style.visibility = "visible";
  document.getElementById("tooltipCountryText").textContent =
    country.properties.name;
  document.getElementById("tooltipGiniText").textContent =
    country.total < 0.01 ? "No data" : country.total.toFixed(2);
}

function mouseLeave(d) {
  d3.selectAll(".Country").transition().duration(200).style("opacity", 0.8);
  d3.select(this)
    .transition()
    .duration(200)
    .style("stroke", "transparent")
    .style("stroke-width", 1);

  document.getElementById("tooltip").style.visibility = "hidden";

}

function drawChoroplethMap(ChoroData) {
  const el = document.getElementById("choropleth-map");
  if (!el) return;

  const width = 800,
    height = 600;

  const svg = d3
    .select(el)
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("width", width)
    .attr("height", height);

  const g = svg.append("g");
  //End of Configuration

  const path = d3.geoPath();
  const projection = d3
    .geoMercator()
    .scale(120)
    .center([0, 20])
    .translate([width / 2, height / 2]);

  // Data and color scale
  const colorScale = d3
    .scaleThreshold()
    .domain([0.2, 0.3, 0.4, 0.5, 0.6])
    .range(d3.schemeReds[7]);

  //Hide tooltip on default
  document.getElementById("tooltip").style.visibility = "hidden";

  // Load external data and boot
  Promise.all([d3.json("data/choropleth-mapdata/world.geojson")]).then(
    function (loadData) {
      let topo = loadData[0];

      // Draw the map
      svg
        .append("g")
        .selectAll("path")
        .data(topo.features)
        .join("path")
        // draw each country
        .attr("d", d3.geoPath().projection(projection))
        // set the color of each country
        .attr("fill", function (d) {
          d.total =
            ChoroData.filter((v) => v.country === d.properties.name)[0]?.gini ||
            0;
          return colorScale(d.total);
        })
        .on("mouseover", mouseOver)
        .on("mouseleave", mouseLeave)
    },
  );
}
