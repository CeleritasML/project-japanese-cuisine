// Set background color to almond
svg.attr("height", height)
  .attr("width", width)
  .style("background","#efdecd");
d3.select("body")
  .style("background","#DEB887");
  
// Sub-tooltip on mouseover displaying dish names
var div = d3.select('body')
  .append('div')
  .attr('class', 'tooltip')
  .attr('style', 'position: absolute; opacity: 0;')
  .style("height", 28 + "px")
  .style("padding", 2 + "px")
  .style("background", "#FF8C00")
  .style("border", 0 + "px")
  .style("border-radius", 8 + "px");

// Main-tooltip at corner displaying nutrition information  
var info = d3.select('body')
  .append('div')
  .attr('class', 'tooltip')
  .attr('style', 'position: absolute; opacity: 0;')
  .style("left", 50 + "px")
  .style("margin", 0 + "auto")
  .style("top", 70 + "%")
  .style("padding", 2 + "px")
  .style("background", "#DEB887")
  .style("border", 0 + "px")
  .style("border-radius", 8 + "px");
  
// Another tooltip at corner providing image of actual recipe
var webpage = svg.append("image")
  .attr('style',"opacity: 0;")
  .attr("xlink:href", null)
  .attr("x", 0)
  .attr("y", 0)
  .attr("width", 200)
  .attr("height", 200);
  
// Read data of nodes and links from r2d3 processed dataframe
const nodes = data.nodes.map(d => Object.create(d));
const links = data.links.map(d => Object.create(d));

// Track the choice status of nodes
var status = new Array(nodes.length).fill(0);

// Set X axis and labels
let sectors = Array.from(new Set(nodes.map((d) => d.nutrition)));
let dishtype = Array.from(new Set(nodes.map((d) => d.type)));
let xScale = d3
      .scalePoint()
      .domain(sectors)
      .range([1/8 * width+60, 7/8 * width+60]);
let xAxis = d3
      .scalePoint()
      .domain(sectors)
      .range([1/8 * width+60, 7/8 * width+60]);
      
svg.append("g")
  .style("font-size", "20px")
  .call(d3.axisBottom(xAxis))

let xType = d3
      .scalePoint()
      .domain(dishtype)
      .range([-110,110])


// Set Y axis 
let yScale = d3
      .scaleLinear()
      .domain([-7,3])
      .range([7/8 * height-60, 1/8 * height+60]);

// Color nodes by their dish types (appetizer, dessert, etc.)      
let color = d3.scaleOrdinal().domain(sectors).range(d3.schemePaired);

// Control node size by their values
let valueDomain = d3.extent(nodes.map((d) => +d.value));
let size = d3.scaleSqrt().domain(valueDomain).range([3, 8]);

// Draw edges between nodes of same dish
const link = svg.append("g")
    .selectAll("line")
    .data(links)
    .enter()
    .append("line")
    .style("stroke", "grey")
    .style('stroke-width', 0.1)
    .style("stroke-opacity", 0.5);
    
// Draw nodes with mouseover and click tooltips
const node = svg.append("g")
    .selectAll(".circ")
    .data(nodes)
    .enter()
    .append("circle")
    .attr("class", "circ")
    .attr("fill", (d) => color(d.type))
    .attr("r", (d) => size(d.value))
    .on("mouseleave", function(event,d) {
      node.style("stroke", function(node) {
        if(status[node.id] != 1) {
          return "none"
        } else {
          return "black"
        }
      });
      div.style('opacity', 0)
      link.style("stroke-width", function(link) {
        if(status[data.links[link.index].source] != 1) {
          return 0.1
        } else {
          return 2
        }
      })
        .style("stroke-opacity", function(link) {
          if(status[data.links[link.index].source] != 1) {
            return 0.5
          } else {
            return 1
          }
        });
    })
    .on("mouseover", function(event,d) {
      node.style("stroke", function(node) {
        if(status[node.id] == 1) {
          return "black"
        } else if(d.name == node.name){
          return "gray"
        } else {
          return "none"
        }})
        .style("stroke-width", function(node) {
        if(status[node.id] == 1) {
          return 2
        } else if(d.name == node.name){
          return 1.5
        } else {
          return 0
        }});
      link.style("stroke-width", function(link) {
        if(status[data.links[link.index].source] == 1) {
          return 2
        } else if(d.name == link.value){
          return 1.5
        } else {
          return 0.1
        }})
        .style("stroke-opacity", function(link) {
        if(status[data.links[link.index].source] == 1) {
          return 1
        } else if(d.name == link.value){
          return 1
        } else {
          return 0
        }});
      div.transition().duration(200)
        .style('opacity', 1);
      div.html(d.name)
        .style('left', event.pageX+10 + 'px')
        .style('top', event.pageY-15 + 'px');
      
    })
    .on("click", function(event,d) {
      status.fill(0);
      info.style("opacity", 0);
      node.style("stroke", "none");
      link.style('stroke-width', 0.1)
        .style("stroke-opacity", 0.5);
      node.style("stroke", function(node) {
        if(d.name == node.name) {
          status[node.id] = 1;
          return "black"
        } else {
          return "none"
        }})
        .style("stroke-width", function(node) {
        if(d.name == node.name) {
          return 2
        } else {
          return 0
        }});
      link.style("stroke-width", function(link) {
        if(d.name == link.value) {
          return 2
        } else {
          return 0.1
        }})
        .style("stroke-opacity", function(link) {
        if(d.name == link.value) {
          return 1
        } else {
          return 0.5
        }});
      info.transition().duration(200)
        .style('opacity', 1);
      var dish = +d.id - (+d.id % 5)
      info.html(d.name + "<br/>"  + "Type: " + data.nodes[dish+1].type
        + "<br/>"  + "Calories: " + data.nodes[dish].value + data.nodes[dish].unit
        + "<br/>"  + "Protein: " + data.nodes[dish+1].value + data.nodes[dish+1].unit
        + "<br/>"  + "Sodium: " + data.nodes[dish+2].value + data.nodes[dish+2].unit
        + "<br/>"  + "Potassium: " + data.nodes[dish+3].value + data.nodes[dish+3].unit
        + "<br/>"  + "Calcium: " + data.nodes[dish+4].value + data.nodes[dish+4].unit
        + "<br/>"  + "(Per serving)");
      webpage.attr("xlink:href", d.url)
      webpage.style('opacity', 1);
    });

// Apply force to make a beeswarm network
let simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(d => d.id).strength(0.01))
    .force("x", d3.forceX((d) => {
        return xScale(d.nutrition)+xType(d.type);
        }).strength(3))
    .force("y", d3.forceY((d) => {
        return yScale(d.value_level);
        }).strength(1))
    .force("collide", d3.forceCollide((d) => {
        return 1.0 * size(d.value);
        }))

// Add annotations about the recommended level of nutrients
svg.append("text")
    .attr("x", 0)
    .attr("y", 270)
    .text("Recommeneded level");
svg.append("text")
    .attr("x", 0)
    .attr("y", 290)
    .text("for an average dish");

var point = svg.append('image')
    .attr('xlink:href', 'https://ykdatalab.georgetown.domains/image/finger.jpg')
    .attr('width', 120)
    .attr('height', 73)
    .attr("x", 0)
    .attr("y", 330)

svg.append("text")
    .attr("x", 300)
    .attr("y", 850)
    .attr("font-size",30)
    .text("Nutrition Beeswarm Plot (Hover/click over nodes to view recipe information)");


simulation
    .nodes(nodes)
    .on("tick", tick);

simulation.force("link")
    .links(links);
    
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