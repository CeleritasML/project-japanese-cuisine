const margin = [50, 60, 50, 100];

svg.attr("height", height)
  .attr("width", width);
let sectors = Array.from(new Set(data.map((d) => d.nutrition)));
let xScale = d3
      .scaleBand()
      .domain(sectors)
      .range([margin[3], width - margin[1]]);
let yScale = d3
      .scaleLinear()
      .domain(d3.extent(data.map((d) => +d.value_norm)))
      .range([1/8 * height, 7/8 * height]);
      
let color = d3.scaleOrdinal().domain(sectors).range(d3.schemePaired);

let valueDomain = d3.extent(data.map((d) => +d.value));
let size = d3.scaleSqrt().domain(valueDomain).range([2, 8]);

const node = svg.append("g")
    .selectAll(".circ")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "circ")
    .attr("fill", (d) => color(d.type))
    .attr("r", (d) => size(d.value));

let simulation = d3.forceSimulation(data)
    .force("x", d3.forceX((d) => {
        return xScale(d.nutrition);
        }).strength(2))
    .force("y", d3.forceY((d) => {
        return yScale(d.value_norm);
        }).strength(3))
    .force("collide", d3.forceCollide((d) => {
        return 1.5 * size(d.value);
        }))
    .on("tick", tick);
    
function tick() {
      node
        .attr("cx", (d) => d.x)
        .attr("cy", (d) => d.y);
}