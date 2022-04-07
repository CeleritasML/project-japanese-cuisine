// The svg
var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

// Map and projection
var path = d3.geoPath();
var projection = d3.geoNaturalEarth()
    .scale(width / 2 / Math.PI)
    .translate([width / 2, height / 2])
var path = d3.geoPath()
    .projection(projection);

// Data and color scale
var data = d3.map();
var colorScheme = d3.schemeBlues[7];
colorScheme.unshift("#eee")
var colorScale = d3.scaleThreshold()
    .domain([1, 2, 6, 11, 26, 51, 76])
    .range(colorScheme);

// Legend
var g = svg.append("g")
    .attr("class", "legendThreshold")
    .attr("transform", "translate(20,20)");
g.append("text")
    .attr("class", "caption")
    .attr("x", 0)
    .attr("y", -6)
    .text("Dishes");
var labels = ['0', '1', '2-5', '6-10', '11-25', '26-50', '51-75', '76+'];
var legend = d3.legendColor()
    .labels(function (d) { return labels[d.i]; })
    .shapePadding(4)
    .scale(colorScale);
svg.select(".legendThreshold")
    .call(legend);

// Connection as constants:

var link = [
    {type: "LineString", coordinates: [[126.9780, 37.5665], [139.6503, 35.6762]]},
    {type: "LineString", coordinates: [[-95.7129, 37.0902], [139.6503, 35.6762]]},
    {type: "LineString", coordinates: [[104.1954, 35.8617], [139.6503, 35.6762]]},
    {type: "LineString", coordinates: [[100.9925, 15.8700], [139.6503, 35.6762]]},
    {type: "LineString", coordinates: [[78.9629, 20.5937], [139.6503, 35.6762]]},
    {type: "LineString", coordinates: [[2.2137, 46.2276], [139.6503, 35.6762]]},
    {type: "LineString", coordinates: [[12.5674, 41.8719], [139.6503, 35.6762]]},
    {type: "LineString", coordinates: [[121.7740, 12.8797], [139.6503, 35.6762]]},
    {type: "LineString", coordinates: [[102.5528, 23.6345], [139.6503, 35.6762]]},
    {type: "LineString", coordinates: [[120.9605, 23.6978], [139.6503, 35.6762]]}
]

// Load external data and boot
d3.queue()
    .defer(d3.json, "world-110m.geojson")
    .defer(d3.csv, "international-dishes.csv", function (d) {
        data.set(d.code, +d.total);
    })
    .await(ready);

// Tooltip

var toolTip = d3.select("body")
    .append("div")
    .style("position", "absolute")
    .style("padding", "0 10px")
    .style("background", "#fff")
    .style("opacity", 0)
    .style("font-family", "Open Sans")
    .style("z-index", 1000);

function ready(error, topo) {
    if (error) throw error;

    // Draw the map
    svg.append("g")
        .attr("class", "countries")
        .selectAll("path")
        .data(topo.features)
        .enter().append("path")
        .attr("fill", function (d) {
            // Pull data for this country
            d.total = data.get(d.id) || 0;
            console.log(data)
            // Set the color
            return colorScale(d.total);
        })
        .attr("d", path)
        .on("mouseover", function(d, i){
            d3.select(this)
                .transition()
                .duration(200)
                .style("opacity", 1);
            toolTip.transition()
                .style("opacity", .9)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY) + "px");

            tempColor = this.style.fill;

            if (d.total != 0) {
                    toolTip.html("Country: " + d.properties.name + "<br>" +
                                "Count: " + d.total)
                } else {
                    toolTip.html("")
                }
        })
        .on("mouseout", function(){

            d3.select(this)
                .transition().delay(400)
                .duration(800)
                .style("opacity", 1)
                .style("fill", tempColor);

        })

    // Draw the arcs

    svg.selectAll("myPath")
        .data(link)
        .enter()
        .append("path")
        .attr("d", function(d){ return path(d)})
        .style("fill", "none")
        .style("stroke", "orange")
        .style("stroke-width", 3)
}