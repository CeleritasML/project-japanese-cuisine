// !preview r2d3 data=dat2, d3_version=7
//
// r2d3: https://rstudio.github.io/r2d3
//
// largely inspired by this awesome blog: https://blog.risingstack.com/tutorial-d3-js-calendar-heatmap/

d3.select('body')
    .style("background-color", "#fffff8")
    .append('defs')
    .append('style')
    .attr('type', 'text/css')
    .text("@import url('https://fonts.googleapis.com/css?family=Roboto Mono');");
svg.style("background-color", "#fffff8")

// nodes map
let nodesById = {};
data.recipes.forEach(d => {
    nodesById[d.id] = {...d};
})
data.ingredients.forEach(d => {
    nodesById[d.id] = {...d};
})

const ref_width = 1860;
const ref_height = 1200;

const all_recipe_category = ["appetizer", "beverage", "breakfast", "dessert", "entree", "salad", "side", "soup-stew"];
const all_ingredient_category = ["condiment (powder)", "condiment (bulk)", "condiment (liquid)", "protein", "vegetable",
                            "fruit", "mushroom/fungus", "carbonhydrates", "processed food", "beverage", "other"];
const recipeDict = {
    "appetizer": {"index": 2, "color": "#f94144"},
    "beverage": {"index": 2.8, "color": "#f3722c"},
    "breakfast": {"index": 3.6, "color": "#f8961e"},
    "dessert": {"index": 4.6, "color": "#f9c74f"},
    "entree": {"index": 6.3, "color": "#90be6d"},
    "salad": {"index": 8, "color": "#43aa8b"},
    "side": {"index": 9, "color": "#4d908e"},
    "soup-stew": {"index": 10.4, "color": "#577590"}
}

const ingredientDict = {
    "condiment (powder)": {"index": 2, "color": "#023047"},
    "condiment (bulk)": {"index": 3, "color": "#264653"},
    "condiment (liquid)": {"index": 4, "color": "#005f73"},
    "protein": {"index": 5, "color": "#0a9396"},
    "vegetable": {"index": 6, "color": "#94d2bd"},
    "fruit": {"index": 7, "color": "#e9d8a6"},
    "mushroom/fungus": {"index": 8, "color": "#ee9b00"},
    "carbonhydrates": {"index": 9, "color": "#ca6702"},
    "processed food": {"index": 10, "color": "#bb3e03"},
    "beverage": {"index": 11, "color": "#ae2012"},
    "other": {"index": 12, "color": "#9b2226"}
}

const recipeColor = (category) => {
    if (!(category in recipeDict)) return "#cfbaf0";
    return recipeDict[category]["color"];
}

const recipeIndex = (category) => {
    if (!(category in recipeDict)) return 9;
    return recipeDict[category]["index"];
}

const ingredientColor = (category) => {
    if (!(category in ingredientDict)) return "#cfbaf0";
    return ingredientDict[category]["color"];
}

const ingredientIndex = (category) => {
    if (!(category in ingredientDict)) return 11;
    return ingredientDict[category]["index"];
}

const links = data.links.map(d => Object.create(d));
const recipes = data.recipes.map(d => Object.create(d));
const ingredients = data.ingredients.map(d => Object.create(d));
const nodes = [...recipes, ...ingredients];
nodes.map(d => {
    d.x = (d.type === "recipe") ? width / 5 : width - width / 5;
    d.y = (d.type === "recipe") ? recipeIndex(d.category) / 12.5 * height : ingredientIndex(d.category) / 14 * height;
});

svg
    .attr("height", height)
    .attr("width", width);

// create link reference
let linkedByIndex = {};
let r2i_dict = {}
all_recipe_category.forEach(c => r2i_dict[c] = {'node': [], 'link': []});
let i2r_dict = {}
all_ingredient_category.forEach(c => i2r_dict[c] = {'node': [], 'link': []});
links.forEach(d => {
    linkedByIndex[`${d.source},${d.target}`] = true;
    i2r_dict[nodesById[d.source].category]['node'].push(nodesById[d.source].id);
    i2r_dict[nodesById[d.source].category]['node'].push(nodesById[d.target].id);
    i2r_dict[nodesById[d.source].category]['link'].push(d);
    linkedByIndex[`${d.target},${d.source}`] = true;
    r2i_dict[nodesById[d.target].category]['node'].push(nodesById[d.target].id);
    r2i_dict[nodesById[d.target].category]['node'].push(nodesById[d.source].id);
    r2i_dict[nodesById[d.target].category]['link'].push(d);
});
all_recipe_category.forEach(c => {
    r2i_dict[c]['node'] = new Set(r2i_dict[c]['node']);
    r2i_dict[c]['link'] = new Set(r2i_dict[c]['link']);
});
all_ingredient_category.forEach(c => {
    i2r_dict[c]['node'] = new Set(i2r_dict[c]['node']);
    i2r_dict[c]['link'] = new Set(i2r_dict[c]['link']);
});

const isConnected = (a, b) => linkedByIndex[`${a},${b}`] || a === b;
const isEqual = (a, b) => a === b;
const nodeRadius = (d => ((d.type === "recipe") ? 0.5 * d.freq : 2 * Math.log(d.freq)) * width / ref_width);
const nodeColor = (d => (d.type === "recipe") ? recipeColor(d.category) : ingredientColor(d.category));

const baseGroup = svg.append("g");

let ifClicked = false;

const simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(d => d.id).strength(0.01))
    .force("charge", d3.forceManyBody())
    .force("x", d3.forceX(d => (d.type === "recipe") ? width / 5 : width - width / 5).strength(2))
    .force("y", d3.forceY(d => (d.type === "recipe") ? recipeIndex(d.category) / 12.5 * height : ingredientIndex(d.category) / 14 * height).strength(1))
    .force("collide", d3.forceCollide().radius(d => nodeRadius(d) + 1).iterations(2))
    .alpha(0.1);

const link = baseGroup.append("g")
    .selectAll("line")
    .data(links)
    .join("line")
    .classed('link', true)
    .style('stroke', "grey")
    .style('stroke-width', 0.05)
    .style("stroke-opacity", 0.5);

const node = baseGroup.append("g")
    .selectAll("circle")
    .data(nodes)
    .join("circle")
    .classed('node', true)
    .attr("r", d => nodeRadius(d))
    .attr("fill", nodeColor);

function ticked() {
    for (let i = 0; i < 100; i++) {
        simulation.tick();
    }
    link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

    node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);
}

simulation
    .nodes(nodes)
    .on("tick", ticked);

simulation.force("link")
    .links(links);

const tooltip = d3.select("body").append("div")
    .attr("class", "svg-tooltip")
    .style("position", "absolute")
    .style("visibility", "hidden")
    .text("I'm a circle!")
    .style("font-family", "Roboto Mono");

const recipe_legend_area = svg.append("g");
const ingredient_legend_area = svg.append("g");

recipe_legend_area
    .append("text")
    .attr("x", width * 0.05)
    .attr("y", height / 10 - 20 * height / ref_height)
    .attr("font-size", 22 * width / ref_width)
    .attr("fill", "#090909")
    .text("Legend of Recipes")
    .style("font-family", "Roboto Mono")

ingredient_legend_area
    .append("text")
    .attr("x", width * 0.85)
    .attr("y", height / 10 - 20 * height / ref_height)
    .attr("font-size", 22 * width / ref_width)
    .attr("fill", "#090909")
    .text("Legend of Ingredients")
    .style("font-family", "Roboto Mono")

const recipe_legend_wrapper = recipe_legend_area
    .selectAll(".recipe-legend-wrapper")
    .data(all_recipe_category)
    .enter()
        .append("g")
        .attr("class", "recipe-legend-wrapper");

const ingredient_legend_wrapper = ingredient_legend_area
    .selectAll(".ingredient-legend-wrapper")
    .data(all_ingredient_category)
    .enter()
        .append("g")
        .attr("class", "ingredient-legend-wrapper");

const recipe_legend_circle = recipe_legend_wrapper
    .append("circle")
    .attr("r", 8 * width / ref_width)
    .attr("fill", d => recipeColor(d))
    .attr("cx", width * 0.05)
    .attr("cy", (d, i) => height / 10 + i * 20 * height / ref_height);

const recipe_legend_text = recipe_legend_wrapper
    .append("text")
    .text(d => d)
    .attr("fill", d => recipeColor(d))
    .attr("x", width * 0.05 + 20)
    .attr("y", (d, i) => height / 10 + i * 20 * height / ref_height)
    .attr("font-size", 18 * width / ref_width)
    .attr("text-anchor", "left")
    .style("font-family", "Roboto Mono")
    .style("alignment-baseline", "middle");

const ingredient_legend_circle = ingredient_legend_wrapper
    .append("circle")
    .attr("r", 8 * width / ref_width)
    .attr("fill", d => ingredientColor(d))
    .attr("cx", width * 0.85)
    .attr("cy", (d, i) => height / 10 + i * 20 * height / ref_height);

const ingredient_legend_text = ingredient_legend_wrapper
    .append("text")
    .text(d => d)
    .attr("fill", d => ingredientColor(d))
    .attr("x", width * 0.85 + 20)
    .attr("y", (d, i) => height / 10 + i * 20 * height / ref_height)
    .attr("font-size", 18 * width / ref_width)
    .attr("text-anchor", "left")
    .style("font-family", "Roboto Mono")
    .style("alignment-baseline", "middle");

const mouseOverFunction = (e, d) => {
    tooltip.style("visibility", "visible")
        .html(() => {
            if (d.type === "recipe") {
                return `<strong>Type:</strong> <span>${d.type}</span>` + '<br>'
                    + `<strong>Name:</strong> <span>${d.name}</span>` + '<br>'
                    + `<strong>Category:</strong> <span>${d.category}</span>` + '<br>'
                    + `<strong>Number of Ingredients:</strong> <span>${d.freq}</span>`;
            }
            return `<strong>Type:</strong> <span>${d.type}</span>` + '<br>'
                + `<strong>Name:</strong> <span>${d.name}</span>` + '<br>'
                + `<strong>Category:</strong> <span>${d.category}</span>` + '<br>'
                + `<strong>Occurrence:</strong> <span>${d.freq}</span>`;
        });
    if (ifClicked) return;
    node
        .transition(500)
        .style('opacity', o => isConnected(o.id, d.id) ? 1.0 : 0.1);
    link
        .transition(500)
        .style('stroke-opacity', o => (o.source === d || o.target === d) ? 1 : 0.1);
};

const mouseOutFunction = (e, d) => {
    tooltip.style("visibility", "hidden");
    if (ifClicked) return;
    node
        .transition(500)
        .style('opacity', 1);
    link
        .transition(500)
        .style("stroke-opacity", 0.5);
};

let clickedNodes = new Set();
let clickedLinks = new Set();

const mouseClickFunction = (e, d) => {
    if (clickedNodes.has(d.id)) {
        return;
    }
    // we don't want the click event bubble up to svg
    e.stopPropagation();
    ifClicked = true;
    nodes
        .map(o => {
            if (!clickedNodes.has(o.id) && isConnected(o.id, d.id)) {
                clickedNodes.add(o.id);
            }
        })
    links
        .map(o => {
            if (!clickedLinks.has(o) && (o.source === d || o.target === d)) {
                clickedLinks.add(o);
            }
        })
    node
        .transition(500)
        .style('opacity', o => (clickedNodes.has(o.id)) ? 1.0 : 0.1);
    link
        .transition(500)
        .style('stroke-opacity', o => (clickedLinks.has(o)) ? 1.0 : 0.1);
};

node.on('mouseover', mouseOverFunction)
    .on('mouseout', mouseOutFunction)
    .on('click', mouseClickFunction)
    .on('mousemove', (e) => tooltip.style("top", (e.pageY-10)+"px").style("left",(e.pageX+10)+"px"));

recipe_legend_wrapper.on('click', function (e, i) {
    clickedNodes = r2i_dict[i]['node'];
    clickedLinks = r2i_dict[i]['link'];
    e.stopPropagation();
    ifClicked = true;
    node
        .transition(500)
        .style('opacity', o => clickedNodes.has(o.id) ? 1.0 : 0.1);
    link
        .transition(500)
        .style('stroke-opacity', o => clickedLinks.has(o) ? 1.0 : 0.1);
});

ingredient_legend_wrapper.on('click', function (e, i) {
    clickedNodes = i2r_dict[i]['node'];
    clickedLinks = i2r_dict[i]['link'];
    e.stopPropagation();
    ifClicked = true;
    node
        .transition(500)
        .style('opacity', o => clickedNodes.has(o.id) ? 1.0 : 0.1);
    link
        .transition(500)
        .style('stroke-opacity', o => clickedLinks.has(o) ? 1.0 : 0.1);
});

svg.on('click', () => {
    ifClicked = false;
    clickedNodes = new Set();
    clickedLinks = new Set();
    node
        .transition(500)
        .style('opacity', 1);
    link
        .transition(500)
        .style("stroke-opacity", 0.5)
});

svg.append("text")
    .attr("x", "50%")
    .attr("y", "3%")
    .attr("text-anchor", "middle")
    .attr("font-size", 25 * width / ref_width)
    .text("How do ingredients and recipes connect and provide the Japanese flavor?")
    .style("font-family", "Roboto Mono")
    .style("font-weight", "bold");

svg.append("text")
    .attr("x", "50%")
    .attr("y", "6%")
    .attr("text-anchor", "middle")
    .attr("font-size", 16 * width / ref_width)
    .text("A Network Visualization of Japanese Cuisines")
    .style("font-family", "Roboto Mono")
    .style("font-weight", "medium");
