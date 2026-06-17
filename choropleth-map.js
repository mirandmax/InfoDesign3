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

  mouseMove(event); // direkt einmal positionieren
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

function mouseMove(event) {
  const tooltip = document.getElementById("tooltip");
  const offsetX = 15; // Abstand nach rechts
  const offsetY = 15; // Abstand nach oben

  // Höhe des Tooltips, um es "über" der Maus zu platzieren
  const ttHeight = tooltip.offsetHeight;

  tooltip.style.left = event.pageX + offsetX + "px";
  tooltip.style.top = event.pageY - ttHeight - offsetY + "px";
}

function drawChoroplethMap(ChoroData) {
  const el = document.getElementById("choropleth-map");
  if (!el) return;

  const width = 800,
    height = 600;
  const legendHeight = 60;

  const svg = d3
    .select(el)
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height + legendHeight}`)
    .attr("width", width)
    .attr("height", height + legendHeight);

  const g = svg.append("g");
  //End of Configuration

  const path = d3.geoPath();
  const projection = d3
    .geoMercator()
    .scale(120)
    .center([0, 20])
    .translate([width / 2, height / 2]);

  const giniValues = ChoroData.map((d) => d.gini).filter(
    (v) => v != null && !isNaN(v),
  );

  const minGini = d3.min(giniValues);
  const maxGini = d3.max(giniValues);
  const step = (maxGini - minGini) / 7;
  const thresholds = d3.range(1, 7).map((i) => minGini + i * step);

  // Data and color scale
  const colorScale = d3
    .scaleThreshold()
    .domain(thresholds)
    .range(d3.schemeReds[7]);

  drawLegend(svg, colorScale, width, height);

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
          const match = ChoroData.filter((v) => v.code === d.id)[0];
          // kein Eintrag gefunden oder kein gültiger Wert -> No Data und graue Fläche
          if (!match || match.gini == null) {
            d.total = -1; 
            return "#e0e0e0";
          }

          d.total = match.gini;
          return colorScale(d.total);
        })
        .on("mouseover", mouseOver)
        .on("mouseleave", mouseLeave)
        .on("mousemove", mouseMove);
    },
  );
}


function drawLegend(svg, colorScale, width, height) {
  const colors = colorScale.range();
  // Breite der Farbrechtecke
  const swatchW = 45;
  // höhe der Rechteccke
  const swatchH = 14;
  const startX = 60;
  //Unter der Karte, deswegen + 15px Abstand
  const startY = height + 15; 

  const legend = svg
    .append("g")
    .attr("class", "legend")
    .attr("transform", `translate(${startX}, ${startY})`);

  // für jede Stufe
  colors.forEach((color, i) => {
    const x = i * swatchW;
    // Obere und untere Greunze der Farbe ermitteln
    const extent = colorScale.invertExtent(color);

    // Farbrechteck anzeigen 
    legend
      .append("rect")
      .attr("x", x)
      .attr("y", 0)
      .attr("width", swatchW)
      .attr("height", swatchH)
      .attr("fill", color);

    // untere Grenze als Label
    legend
      .append("text")
      .attr("x", x)
      .attr("y", swatchH + 14)
      .attr("text-anchor", "middle")
      .attr("font-size", 10)
      .attr("fill", "black")
      .text(extent[0] != null ? extent[0].toFixed(2) : "");
  });

  // keine Daten Fläche
  const noDataX = colors.length * swatchW + 30;

  //Graues Rechteck für "keine Daten" in Legende
  legend
    .append("rect")
    .attr("x", noDataX)
    .attr("y", 0)
    .attr("width", swatchW)
    .attr("height", swatchH)
    .attr("fill", "#cccccc"); // graue Fläche

  //Label für keine Daten
  legend
    .append("text")
    .attr("x", noDataX + swatchW / 2)
    .attr("y", swatchH + 14)
    .attr("text-anchor", "middle")
    .attr("font-size", 10)
    .attr("fill", "#374151")
    .text("No data");
}