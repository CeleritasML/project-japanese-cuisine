var width = 1920;
var height = 1080;
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
      .range([600, 300]);
      
let color = d3.scaleOrdinal().domain(sectors).range(d3.schemePaired);

let valueDomain = d3.extent(data.map((d) => +d.value));
let size = d3.scaleSqrt().domain(valueDomain).range([10, 40]);

svg.selectAll(".circ")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "circ")
    .attr("stroke", "black")
    .attr("fill", (d) => color(d.type))
    .attr("r", (d) => size(d.value))
    .attr("cx", (d) => xScale(d.nutrition))
    .attr("cy", (d) => yScale(d.value_norm));

let simulation = d3.forceSimulation(data)
    
    .force("x", d3.forceX((d) => {
        return xScale(d.nutrition);
        }).strength(0.2))
    
    .force("y", d3.forceY((d) => {
        return yScale(d.value_norm);
        }).strength(1))
    
    .force("collide", d3.forceCollide((d) => {
        return size(d.value);
        }))
    
    .alphaDecay(0)
    .alpha(0.3)
    .on("tick", tick);
    
function tick() {
      d3.selectAll(".circ")
        .attr("cx", (d) => d.x)
        .attr("cy", (d) => d.y);
    }

let init_decay = setTimeout(function () {
    console.log("start alpha decay");
    simulation.alphaDecay(0.1);
    }, 5000);