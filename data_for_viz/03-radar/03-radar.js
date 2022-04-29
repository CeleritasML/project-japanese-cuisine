// !preview r2d3 data=dat2, d3_version=6
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

const recipeDict = {
    "appetizer": {"index": 1, "color": "#f94144"},
    "beverage": {"index": 2, "color": "#f3722c"},
    "breakfast": {"index": 3, "color": "#f8961e"},
    "dessert": {"index": 4, "color": "#f9c74f"},
    "entree": {"index": 5, "color": "#90be6d"},
    "salad": {"index": 6, "color": "#43aa8b"},
    "side": {"index": 7, "color": "#4d908e"},
    "soup_stew": {"index": 8, "color": "#577590"}
};

const recipeColor = (category) => {
    return recipeDict[category]["color"];
}

const g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
const ddata = data.radar.map(d => d.values);

const max_value = 0.4;
const all_axis = ddata[0].map((d, i) => d.ingredient);
const all_category = ["appetizer", "beverage", "breakfast", "dessert", "entree", "salad", "side", "soup_stew"];
const max_radius = 0.5 * Math.min(width / 2, height / 2);
const radius_level = 5;
const angle = Math.PI * 2 / all_axis.length;
const radius_scale = d3.scaleLinear().range([0, max_radius]).domain([0, max_value]);
const format = d3.format('.2f');

const filter = g.append('defs').append('filter').attr('id','glow'),
    feGaussianBlur = filter.append('feGaussianBlur').attr('stdDeviation','2.5').attr('result','coloredBlur'),
    feMerge = filter.append('feMerge'),
    feMergeNode_1 = feMerge.append('feMergeNode').attr('in','coloredBlur'),
    feMergeNode_2 = feMerge.append('feMergeNode').attr('in','SourceGraphic');

// grid & axis

const axisGrid = g.append("g").attr("class", "axisWrapper");

axisGrid.selectAll(".levels")
    .data(d3.range(1, radius_level + 1).reverse())
    .enter()
        .append("circle")
        .attr("class", "gridCircle")
        .attr("r", (d, i) => max_radius / radius_level * d)
        .style("fill", "#CDCDCD")
        .style("stroke", "#CDCDCD")
        .style("fill-opacity", 0.1)
        .style("filter" , "url(#glow)");

axisGrid.selectAll(".axisLabel")
    .data(d3.range(1, radius_level + 1).reverse())
    .enter()
        .append("text")
        .attr("class", "axisLabel")
        .attr("x", 4)
        .attr("y", d => -d * max_radius / radius_level)
        .attr("dy", "0.4em")
        .style("font-size", "10px")
        .attr("fill", "#737373")
        .text((d, i) => format(max_value * d / radius_level));

const axis = axisGrid.selectAll(".axis")
    .data(all_axis)
    .enter()
        .append("g")
        .attr("class", "axis");

axis.append("line")
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", (d, i) => radius_scale(max_value * 1.1) * Math.cos(angle * i - Math.PI / 2))
    .attr("y2", (d, i) => radius_scale(max_value * 1.1) * Math.sin(angle * i - Math.PI / 2))
    .attr("class", "line")
    .style("stroke", "white")
    .style("stroke-width", "2px");

axis.append("text")
    .attr("class", "legend")
    .style("font-size", "11px")
    .style("font-family", "Roboto Mono")
    .attr("text-anchor", "middle")
    .attr("dy", "0.35em")
    .attr("x", (d, i) => radius_scale(max_value * 1.25) * Math.cos(angle * i - Math.PI / 2))
    .attr("y", (d, i) => radius_scale(max_value * 1.25) * Math.sin(angle * i - Math.PI / 2))
    .text(d => d);

// Radial
const radar_line = d3.lineRadial()
    .curve(d3.curveCardinalClosed)
    .radius(d => radius_scale(d.value))
    .angle((d, i) => i * angle);

const blob_wrapper = g.selectAll(".radar-wrapper")
    .data(ddata)
    .enter()
        .append("g")
        .attr("class", d => "radar-wrapper radar-wrapper-" + d[0].category);

const backgrounds = blob_wrapper
    .append("path")
    .attr("class", d => "radar-area")
    .attr("d", (d, i) => radar_line(d))
    .style("fill", (d, i) => recipeColor(d[0].category))
    .style("fill-opacity", 0.1);

const outline = blob_wrapper.append("path")
    .attr("class", "radar-stroke")
    .attr("d", (d, i) => radar_line(d))
    .style("stroke-width", "1.25px")
    .style("stroke", (d, i) => recipeColor(d[0].category))
    .style("fill", "none")
    .style("filter" , "url(#glow)");

const circle = blob_wrapper.selectAll(".radar-circle")
    .data((d, i) => d)
    .enter()
        .append("circle")
        .attr("class", "radar-circle")
        .attr("r", 3)
        .attr("cx", (d, i) => radius_scale(d.value) * Math.cos(angle * i - Math.PI / 2))
        .attr("cy", (d, i) => radius_scale(d.value) * Math.sin(angle * i - Math.PI / 2))
        .style("fill", (d, i) => recipeColor(d.category))
        .style("fill-opacity", 0.8);

const legend_area = svg.append("g");

legend_area
    .append("text")
    .attr("x", width / 20)
    .attr("y", height / 10 - 20)
    .attr("fill", "#090909")
    .text("Legend of Recipes")
    .style("font-family", "Roboto Mono")

const legend_wrapper = legend_area
    .selectAll(".legend-wrapper")
    .data(all_category)
    .enter()
        .append("g")
        .attr("class", "legend-wrapper");

const legend_circle = legend_wrapper
    .append("circle")
    .attr("r", 8)
    .attr("fill", d => recipeColor(d))
    .attr("cx", width / 20)
    .attr("cy", (d, i) => height / 10 + i * 20);

const legend_text = legend_wrapper
    .append("text")
    .text(d => d)
    .attr("fill", d => recipeColor(d))
    .attr("x", width / 20 + 20)
    .attr("y", (d, i) => height / 10 + i * 20)
    .attr("text-anchor", "left")
    .style("font-family", "Roboto Mono")
    .style("alignment-baseline", "middle");

let is_clicked = false;

legend_wrapper
    .on("mouseover", function (d, i) {
        if (is_clicked) return;
        blob_wrapper
            .each(function(o) {
                if (o[0].category === i) d3.select(this).raise();
            });
        backgrounds
            .transition().duration(200)
            .style("fill-opacity", o => (o[0].category === i) ? 0.8 : 0.1);
    })
    .on("mouseout", function (d, i) {
        if (is_clicked) return;
        backgrounds
            .transition().duration(200)
            .style("fill-opacity", 0.1);
    })
    .on("click", function (d, i) {
        d.stopPropagation();
        blob_wrapper
            .each(function(o) {
                if (o[0].category === i) d3.select(this).raise();
            });
        backgrounds
            .transition().duration(200)
            .style("fill-opacity", o => (o[0].category === i) ? 0.8 : 0.1);
        is_clicked = true;
    });

svg.
    on("click", function (d, i) {
        backgrounds
            .transition().duration(200)
            .style("fill-opacity", 0.1);
        is_clicked = false;
    });

svg.append("text")
    .attr("x", "50%")
    .attr("y", "5%")
    .attr("text-anchor", "middle")
    .attr("font-size", 25)
    .text("Ingredient Usage in Japanese Dishes")
    .style("font-family", "Roboto Mono")
    .style("font-weight", "bold");

svg.append("text")
    .attr("x", "50%")
    .attr("y", "8%")
    .attr("text-anchor", "middle")
    .attr("font-size", 12)
    .text("Relative usage score of a type of dishes is the coverage rate of ingredients.")
    .style("font-family", "Roboto Mono")
    .style("font-weight", "medium");