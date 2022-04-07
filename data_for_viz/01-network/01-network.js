// !preview r2d3 data=dat2, d3_version=7
//
// r2d3: https://rstudio.github.io/r2d3
//
// largely inspired by this awesome blog: https://blog.risingstack.com/tutorial-d3-js-calendar-heatmap/

const links = data.links.map(d => Object.create(d));
const recipes = data.recipes.map(d => Object.create(d));
const ingredients = data.ingredients.map(d => Object.create(d));
const nodes = [...recipes, ...ingredients];

svg
    .attr("height", height)
    .attr("width", width);

// create link reference
let linkedByIndex = {};
data.links.forEach(d => {
    linkedByIndex[`${d.source},${d.target}`] = true;
});

// nodes map
let nodesById = {};
data.recipes.forEach(d => {
    nodesById[d.id] = {...d};
})
data.ingredients.forEach(d => {
    nodesById[d.id] = {...d};
})

const recipeDict = {
    "appetizer": {"index": 1, "color": "#fbf8cc"},
    "beverage": {"index": 2, "color": "#fde4cf"},
    "breakfast": {"index": 3, "color": "#ffcfd2"},
    "dessert": {"index": 4, "color": "#f1c0e8"},
    "entree": {"index": 5, "color": "#cfbaf0"},
    "salad": {"index": 6, "color": "#a3c4f3"},
    "side": {"index": 7, "color": "#90dbf4"},
    "soup-stew": {"index": 8, "color": "#8eecf5"}
}

const ingredientDict = {
    "condiment (powder)": {"index": 1, "color": "#023047"},
    "condiment (bulk)": {"index": 2, "color": "#264653"},
    "condiment (liquid)": {"index": 3, "color": "#005f73"},
    "protein": {"index": 4, "color": "#0a9396"},
    "vegetable": {"index": 5, "color": "#94d2bd"},
    "fruit": {"index": 6, "color": "#e9d8a6"},
    "mushroom/fungus": {"index": 7, "color": "#ee9b00"},
    "carbonhydrates": {"index": 8, "color": "#ca6702"},
    "processed food": {"index": 9, "color": "#bb3e03"},
    "beverage": {"index": 10, "color": "#ae2012"},
    "other": {"index": 11, "color": "#9b2226"}
}

const recipeColor = (category) => {
    if (!(category in recipeDict)) return "#cfbaf0";
    return recipeDict[category]["color"];
}

const recipeIndex = (category) => {
    if (!(category in recipeDict)) return 8;
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

const isConnectedAsSource = (a, b) => linkedByIndex[`${a},${b}`];
const isConnectedAsTarget = (a, b) => linkedByIndex[`${b},${a}`];
const isConnected = (a, b) => isConnectedAsTarget(a, b) || isConnectedAsSource(a, b) || a === b;
const isEqual = (a, b) => a === b;
const nodeRadius = d => {
    if (d.type === "recipe") {
        return 0.5 * d.freq;
    }
    return 2 * Math.log(d.freq);
};
const nodeColor = d => {
    if (d.type === "recipe") {
        return recipeColor(d.category);
    }
    if (d.type === "ingredient") {
        return ingredientColor(d.category);
    }
    return "#FFFFFF";
};

const baseGroup = svg.append("g");

const zoom = d3.zoom()
    .scaleExtent([0.2, 8])
    .on("zoom", ({transform}) => baseGroup.attr("transform", transform));

svg.call(zoom);
let ifClicked = false;

const simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) { return d.id; }).strength(0.01))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("x", d3.forceX(d => {
        if (d.type === "recipe") {
            return width / 5;
        }
        return width - width / 5;
    }).strength(2))
    .force("y", d3.forceY(d => {
        if (d.type === "recipe") {
            return recipeIndex(d.category) / 9 * height;
        }
        if (d.type === "ingredient") {
            return ingredientIndex(d.category) / 12 * height;
        }
        return height / 2;
    }).strength(1))
    .force("collide", d3.forceCollide().radius(d => nodeRadius(d) + 1).iterations(2));

const link = baseGroup.append("g")
    .selectAll("line")
    .data(links)
    .join("line")
    .classed('link', true)
    .style('stroke', d => {
        return "grey";
    })
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
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
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
    .text("I'm a circle!");

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
        .style('opacity', o => {
            const isConnectedValue = isConnected(o.id, d.id);
            if (isConnectedValue) {
                return 1.0;
            }
            return 0.1;
        });

    link
        .transition(500)
        .style('stroke-opacity', o => {
            return (o.source === d || o.target === d ? 1 : 0.1)})
        .transition(500)
        .attr('marker-end', o => (o.source === d || o.target === d ? 'url(#arrowhead)' : 'url()'));
};

const mouseOutFunction = (e, d) => {
    tooltip.style("visibility", "hidden");

    if (ifClicked) return;

    node
        .transition(500)
        .style('opacity', 1);

    link
        .transition(500)
        .style("stroke-opacity", o => {
        });

};

const mouseClickFunction = (e, d) => {
    // we don't want the click event bubble up to svg
    e.stopPropagation();
    ifClicked = true;

    node
        .transition(500)
        .style('opacity', 1)

    link
        .transition(500);

    node
        .transition(500)
        .style('opacity', o => {
            const isConnectedValue = isConnected(o.id, d.id);
            if (isConnectedValue) {
                return 1.0;
            }
            return 0.1
        })

    link
        .transition(500)
        .style('stroke-opacity', o => (o.source === d || o.target === d ? 1 : 0.1))
        .transition(500)
        .attr('marker-end', o => (o.source === d || o.target === d ? 'url(#arrowhead)' : 'url()'));
};

node.on('mouseover', mouseOverFunction)
    .on('mouseout', mouseOutFunction)
    .on('click', mouseClickFunction)
    .on('mousemove', (e) => tooltip.style("top", (e.pageY-10)+"px").style("left",(e.pageX+10)+"px"));

svg.on('click', () => {
    ifClicked = false;
    node
        .transition(500)
        .style('opacity', 1);

    link
        .transition(500)
        .style("stroke-opacity", 0.5)
});