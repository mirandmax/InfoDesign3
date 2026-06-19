// set the dimensions and margins of the graph
var margin = {top: 30, right: 40, bottom: 30, left: 60},
    width = 250 - margin.left - margin.right,
    height = 210 - margin.top - margin.bottom;

//Read data
Promise.all([
    d3.csv('data/gdp-per-capita-worldbank/gdp-per-capita-worldbank.csv'),
    d3.csv('data/tax-revenues-vs-income-inequality/tax-revenues-vs-income-inequality.csv')
]).then(function([gdpData, giniData]) {

    // TODO: decide which countries to keep
    const keepCountry = ['Sweden', 'Germany', 'Poland', 'Brazil', 'Colombia', 'Mexico', 'Indonesia', 'Turkey', 'Zambia']; 
    
    // Parse and clean GDP data
    gdpData.forEach(function(d) {
        if (d.Year !== undefined) d.Year = +d.Year.toString().replace(/,/g, '');
        if (d['GDP per capita'] !== undefined) {
            const gdp = d['GDP per capita'].toString().replace(/,/g, '');
            d['GDP per capita'] = gdp === '' ? NaN : +gdp;
        }
    });

    // Parse and clean Gini data and build lookup map by Entity+Year
    const giniMap = new Map();
    giniData.forEach(function(d) {
        if (d.Year !== undefined) d.Year = +d.Year.toString().replace(/,/g, '');
        const g = d['Gini coefficient'] !== undefined ? d['Gini coefficient'].toString().replace(/,/g, '') : '';
        const gval = g === '' ? NaN : +g;
        giniMap.set(d.Entity + '||' + d.Year, gval);
    });

    // Merge Gini into GDP rows (match on Entity + Year)
    gdpData.forEach(function(d) {
        const key = d.Entity + '||' + d.Year;
        d['Gini coefficient'] = giniMap.has(key) ? giniMap.get(key) : NaN;
    });

    // Keep only some rows 
    const filteredData = gdpData.filter(function(d) {
        return keepCountry.includes(d.Entity);
    });

    data = filteredData

    // group the data: I want to draw one line per group
    const sumstat = d3.group(data, d => d.Entity) // nest function allows to group the calculation per level of a factor

    // Preserve the country order from keepCountry
    const orderedSumstat = keepCountry
        .filter(country => sumstat.has(country))
        .map(country => [country, sumstat.get(country)]);

    allKeys = new Set(orderedSumstat.map(d => d[0]));

    // Add an svg element for each group. The will be one beside each other and will go on the next row when no more room available
    const svg = d3.select("#line-chart-matrix")
        .selectAll("uniqueChart")
        .data(orderedSumstat)
        .enter()
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform",`translate(${margin.left},${margin.top})`);

    // Add X axis --> it is a date format
    const x = d3.scaleLinear()
        .domain(d3.extent(data, function(d) { return d.Year; }))
        .range([ 0, width ]);
    
    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x).ticks(3).tickFormat(d3.format("d")));

    //Add Y axis
    const y = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) { return +d['GDP per capita']; })])
        .range([ height, 0 ]);
    
    svg.append("g")
        .call(d3.axisLeft(y).ticks(5));

    //Add second Y axis for Gini coefficient
    const y2 = d3.scaleLinear()
        .domain([0.25, 0.6]) // Gini coefficient ranges from 0 to 0.6
        .range([ height, 0 ]);

    svg.append("g")
        .attr("transform", `translate(${width}, 0)`)
        .call(d3.axisRight(y2).ticks(5));


        
    // Add axis labels
    svg.append("text")
        .attr("x", -height / 2)
        .attr("y", -50)
        .attr("transform", "rotate(-90)")
        .attr("text-anchor", "middle")
        .attr("font-size", "11px")
        .attr("fill", "#666")
        .text("GDP per capita");

    svg.append("text")
        .attr("x", -height / 2)
        .attr("y", width + 40)
        .attr("transform", "rotate(-90)")
        .attr("text-anchor", "middle")
        .attr("font-size", "11px")
        .attr("fill", "#666")
        .text("Gini coefficient");

    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height + 30)
        .attr("text-anchor", "middle")
        .attr("font-size", "11px")
        .attr("fill", "#666")
        .text("Year");

    // color palette
    const color = d3.scaleOrdinal().range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#a65628','#f781bf','#999999', '#964675'])

    // Create tooltip
    const tooltip = d3.select("body").append("div")
        .style("position", "absolute")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("padding", "8px")
        .style("font-size", "12px")
        .style("pointer-events", "none")
        .style("opacity", 0)
        .style("z-index", 1000);


    // -------------------------------------
    // | Draw background arrow             |
    // -------------------------------------

    // 1. Define arrow markers in the defs section (red for increasing Gini, green for decreasing)
    const defs = svg.append("defs");

    function createMarker(id, color) {
        defs.append("marker")
            .attr("id", id)
            .attr("viewBox", "0 -5 10 10")
            .attr("refX", 10)
            .attr("refY", 0)
            .attr("markerWidth", 20)
            .attr("markerHeight", 20)
            .attr("orient", "auto")
        .append("path")
            .attr("d", "M0,-5L10,0L0,5")
            .attr("fill", color);
    }

    createMarker("bg-arrow-red", "#e41a1c40");
    createMarker("bg-arrow-green", "#4daf4a40");


    // 2. BACKGROUND LAYER: Draw arrow colored by Gini trend (red=up, green=down)
    svg.append("line")
        .attr("x1", 10)
        .attr("y1", function(d) {
            const startYear = d3.min(d[1], v => v.Year);
            const entry = d[1].find(v => v.Year === startYear);
            const g = entry && !isNaN(+entry['Gini coefficient']) ? +entry['Gini coefficient'] : (d3.mean(d[1], v => +v['Gini coefficient']) || 0);
            return y2(g);
        })
        .attr("x2", 140)
        .attr("y2", function(d) {
            const endYear = d3.max(d[1], v => v.Year);
            const entry = d[1].find(v => v.Year === endYear);
            const g = entry && !isNaN(+entry['Gini coefficient']) ? +entry['Gini coefficient'] : (d3.mean(d[1], v => +v['Gini coefficient']) || 0);
            return y2(g);
        })
        .attr("stroke", function(d) {
            const startYear = d3.min(d[1], v => v.Year);
            const endYear = d3.max(d[1], v => v.Year);
            const startEntry = d[1].find(v => v.Year === startYear);
            const endEntry = d[1].find(v => v.Year === endYear);
            const startGini = startEntry && !isNaN(+startEntry['Gini coefficient']) ? +startEntry['Gini coefficient'] : (d3.mean(d[1], v => +v['Gini coefficient']) || 0);
            const endGini = endEntry && !isNaN(+endEntry['Gini coefficient']) ? +endEntry['Gini coefficient'] : (d3.mean(d[1], v => +v['Gini coefficient']) || 0);
            return endGini > startGini ? "#e41a1c40" : "#4daf4a40"; // red if increasing, green if decreasing
        })
        .attr("stroke-width", 1.5)
        .attr("marker-end", function(d) {
            const startYear = d3.min(d[1], v => v.Year);
            const endYear = d3.max(d[1], v => v.Year);
            const startEntry = d[1].find(v => v.Year === startYear);
            const endEntry = d[1].find(v => v.Year === endYear);
            const startGini = startEntry && !isNaN(+startEntry['Gini coefficient']) ? +startEntry['Gini coefficient'] : (d3.mean(d[1], v => +v['Gini coefficient']) || 0);
            const endGini = endEntry && !isNaN(+endEntry['Gini coefficient']) ? +endEntry['Gini coefficient'] : (d3.mean(d[1], v => +v['Gini coefficient']) || 0);
            return endGini > startGini ? "url(#bg-arrow-red)" : "url(#bg-arrow-green)";
        });

    
    // -------------------------------------
    // | Draw line (GDP per capita)        |
    // -------------------------------------

    // Draw the line
    svg.append("path")
        .attr("fill", "none")
        .attr("stroke", function(d){ return color(d[0]) })
        .attr("stroke-width", 1.9)
        .attr("d", function(d){
        return d3.line()
            .x(function(d) { return x(d.Year); })
            .y(function(d) { return y(+d['GDP per capita']); })
            (d[1])
        })


    // -------------------------------------
    // | Hover interaction                 |
    // -------------------------------------

    // Add circles for hover interaction
    svg.selectAll("dot")
        .data(function(d) { return d[1]; })
        .enter()
        .append("circle")
            .attr("cx", function(d) { return x(d.Year); })
            .attr("cy", function(d) { return y(+d['GDP per capita']); })
            .attr("r", 1)
            .attr("fill", function(d) { return color(d.Entity); })
            .attr("stroke", function(d) { return "black"; })
            .attr("stroke-width", 1)
            .style("opacity", 0)
            .on("mouseover", function(event, d) {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .style("opacity", 1)
                    .attr("r", 3);
                
                tooltip
                    .style("opacity", 1)
                    .html(`Year: ${d.Year.toString().replace(/,/g,'')}<br/>GDP per capita: $${(+d['GDP per capita']).toFixed(2)}`)
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mousemove", function(event) {
                tooltip
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", function() {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .style("opacity", 0)
                    .attr("r", 3);
                
                tooltip
                    .style("opacity", 0);
            });

    // Add titles
    svg.append("text")
        .attr("text-anchor", "start")
        .attr("y", -5)
        .attr("x", 0)
        .text(function(d){ return(d[0])})
        .style("fill", function(d){ return color(d[0]) })

})