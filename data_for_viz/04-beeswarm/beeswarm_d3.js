// Set background color to almond
svg.attr("height", height)
  .attr("width", width)
  .style("background","#efdecd");
d3.select("body")
  .style("background","#DEB887");
  
// Sub-tooltip on mouseover displaying dish names
const div = d3.select('body')
  .append('div')
  .attr('class', 'tooltip')
  .attr('style', 'position: absolute; opacity: 0;')
  .style("height", 28 + "px")
  .style("padding", 2 + "px")
  .style("background", "#FF8C00")
  .style("border", 0 + "px")
  .style("border-radius", 8 + "px");

// Main-tooltip at corner displaying nutrition information  
const info = d3.select('body')
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
const webpage = svg.append("image")
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
const status = new Array(nodes.length).fill(0);

// Set X axis and labels
const sectors = Array.from(new Set(nodes.map((d) => d.nutrition)));
const dishtype = Array.from(new Set(nodes.map((d) => d.type)));
const xScale = d3
      .scalePoint()
      .domain(sectors)
      .range([1/8 * width+60, 7/8 * width+60]);
const xAxis = d3
      .scalePoint()
      .domain(sectors)
      .range([1/8 * width+60, 7/8 * width+60]);
      
svg.append("g")
  .style("font-size", "20px")
  .call(d3.axisBottom(xAxis))

const xType = d3
      .scalePoint()
      .domain(dishtype)
      .range([-110,110])


// Set Y axis 
const yScale = d3
      .scaleLinear()
      .domain([-7,3])
      .range([7/8 * height-60, 1/8 * height+60]);

// Color nodes by their dish types (appetizer, dessert, etc.)      
const color = d3.scaleOrdinal().domain(dishtype).range(d3.schemePaired);

// Control node size by their values
const valueDomain = d3.extent(nodes.map((d) => +d.value));
const size = d3.scaleSqrt().domain(valueDomain).range([3, 8]);

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
    .on("mouseout", function(event,d) {
      node.style("stroke", o => (status[o.id] !== 1) ? "none" : "black");
      div.transition().duration(200)
        .style('opacity', 0);
      link
        .style("stroke-width", o => (status[data.links[o.index].source] !== 1) ? 0.1 : 2)
        .style("stroke-opacity", o => (status[data.links[o.index].source] !== 1) ? 0.5 : 1);
    })
    .on("mouseover", function(event,d) {
      node.style("stroke", o => (status[o.id] === 1) ? "black" : ((d.name === o.name) ? "gray" : "none"))
        .style("stroke-width", o => (status[o.id] === 1) ? 2 : ((d.name === o.name) ? 1.5 : 0));
      link
        .style("stroke-width", o => (status[data.links[o.index].source] === 1) ? 2 : ((d.name == o.value) ? 1.5 : 0.1))
        .style("stroke-opacity", o => (status[data.links[o.index].source] === 1) ? 1 : ((d.name == o.value) ? 1 : 0));
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
      node.style("stroke", o => function(node) {
        if(d.name == node.name) {
          status[node.id] = 1;
          return "black"
        } else {
          return "none"
        }})
        .style("stroke-width", o => (d.name === o.name) ? 2 : 0);
      link.style("stroke-width", o => (d.name === o.value) ? 2 : 0.1)
        .style("stroke-opacity", o => (d.name === o.value) ? 1 : 0.5);
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
const simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(d => d.id).strength(0.01))
    .force("x", d3.forceX(d => xScale(d.nutrition)+xType(d.type)).strength(3))
    .force("y", d3.forceY(d => yScale(d.value_level)).strength(1))
    .force("collide", d3.forceCollide(d => 1.0 * size(d.value)))
    .alpha(0.1)

// Add annotations about the recommended level of nutrients
svg.append("text")
    .attr("x", 10)
    .attr("y", 7 * height / 20 - 20)
    .text("Recommeneded level");
svg.append("text")
    .attr("x", 10)
    .attr("y", 7 * height / 20)
    .text("for an average dish");

const point = svg.append('image')
    .attr('xlink:href', 'https://ykdatalab.georgetown.domains/image/finger.jpg')
    .attr('width', 120)
    .attr('height', 73)
    .attr("x", 10)
    .attr("y", 7 * height / 20 + 12)

svg.append("text")
    .attr("x", "50%")
    .attr("y", "90%")
    .attr("text-anchor", "middle")
    .attr("font-size", 25)
    .text("Nutrition Beeswarm Plot (Hover/click over nodes to view recipe information)");

// Add one dot in the legend for each type.
svg.selectAll("mydots")
  .data(dishtype)
  .enter()
  .append("circle")
    .attr("cx", 1700)
    .attr("cy", (d, i) => 50 + i*20)
    .attr("r", 7)
    .style("fill", d => color(d))
    .style("stroke", "black")
    .style("stroke-opacity", 1)

// Add one dot in the legend for each types.
svg.selectAll("mylabels")
  .data(dishtype)
  .enter()
  .append("text")
    .attr("x", 1720)
    .attr("y", (d, i) => 50 + i*20)
    .style("fill", d => color(d))
    .text(d => d)
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle")
    .style("stroke", "black")
    .style("stroke-opacity", 0.2)
    
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