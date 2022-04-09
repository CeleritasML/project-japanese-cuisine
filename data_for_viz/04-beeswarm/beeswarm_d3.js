const margin = [50, 60, 50, 100];
width = 1820
height = 920
svg.attr("height", height)
  .attr("width", width);

console.log(JSON.stringify(data.links[1]))

let sectors = Array.from(new Set(data.nodes.map((d) => d.nutrition)));
let xScale = d3
      .scalePoint()
      .domain(sectors)
      .range([1/8 * width+margin[0], 7/8 * width+margin[0]]);
let xAxis = d3
      .scalePoint()
      .domain(sectors)
      .range([1/8 * width+margin[0], 7/8 * width+margin[0]]);
svg.append("g")
  .style("font-size", "20px")
  .call(d3.axisBottom(xAxis))
let yScale = d3
      .scaleLinear()
      .domain(d3.extent(data.nodes.map((d) => +d.value_norm)))
      .range([1/8 * height+margin[1], 6/8 * height+margin[1]]);
      
let color = d3.scaleOrdinal().domain(sectors).range(d3.schemePaired);

let valueDomain = d3.extent(data.nodes.map((d) => +d.value));
let size = d3.scaleSqrt().domain(valueDomain).range([3, 8]);

var link = svg.append("g")
    .selectAll("line")
    .data(data.links)
    .enter().append("line")
    .style("stroke", "gray")
    .attr("stroke-width", (d) => d.value);

const node = svg.append("g")
    .selectAll(".circ")
    .data(data.nodes)
    .enter()
    .append("circle")
    .attr("class", "circ")
    .attr("fill", (d) => color(d.type))
    .attr("r", (d) => size(d.value));

let simulation = d3.forceSimulation(data.nodes)
    .force("x", d3.forceX((d) => {
        return xScale(d.nutrition);
        }).strength(3))
    .force("y", d3.forceY((d) => {
        return yScale(d.value_norm);
        }).strength(2))
    .force("collide", d3.forceCollide((d) => {
        return 1.5 * size(d.value);
        }))
    .on("tick", tick);
    
function tick() {
      node
        .attr("cx", (d) => d.x)
        .attr("cy", (d) => d.y);
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);
}