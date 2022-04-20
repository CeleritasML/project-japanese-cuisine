# 2022-04-20
# Rui Qiu (rq47)

if (!require("pacman")) install.packages("pacman")
pacman::p_load(tidyverse, sigmajs, fromJSON)

# working example:

nodes <- sg_make_nodes()
edges <- sg_make_edges(nodes)

sigmajs() |>
  sg_nodes(nodes, id, size, color) |>
  sg_edges(edges, id, source, target)

# nodes

df_ing <- fromJSON("data_for_viz/01-network/ingredient_nodes.json") |>
  as_tibble(validate = FALSE)

ing_color_vec <- rep("black", length(unique(df_ing$category)))
names(ing_color_vec) <- unique(df_ing$category)
ing_color_vec[names(ing_color_vec) == "condiment (powder)"] <- "#023047"
ing_color_vec[names(ing_color_vec) == "condiment (bulk)"] <- "#264653"
ing_color_vec[names(ing_color_vec) == "condiment (liquid)"] <- "#005f73"
ing_color_vec[names(ing_color_vec) == "protein"] <- "#0a9396"
ing_color_vec[names(ing_color_vec) == "vegetable"] <- "#94d2bd"
ing_color_vec[names(ing_color_vec) == "fruit"] <- "#e9d8a6"
ing_color_vec[names(ing_color_vec) == "mushroom/fungus"] <- "#ee9b00"
ing_color_vec[names(ing_color_vec) == "carbonhydrates"] <- "#ca6702"
ing_color_vec[names(ing_color_vec) == "processed food"] <- "#bb3e03"
ing_color_vec[names(ing_color_vec) == "beverage"] <- "#ae2012"
ing_color_vec[names(ing_color_vec) == "other"] <- "#9b2226"

ing_nodes <- sg_make_nodes(n = nrow(df_ing))
ing_nodes$id <- df_ing$id
ing_nodes$label <- df_ing$name
ing_nodes$size <- df_ing$freq
ing_nodes$color <- df_ing$category
ing_nodes <- ing_nodes |>
  mutate(color = ing_color_vec[as.character(color)])

df_rcp <- fromJSON("data_for_viz/01-network/recipe_nodes.json") |>
  as_tibble(validate = FALSE)

rcp_color_vec <- rep("black", length(unique(df_rcp$category)))
names(rcp_color_vec) <- unique(df_rcp$category)
rcp_color_vec[names(rcp_color_vec) == "appetizer"] <- "#fbf8cc"
rcp_color_vec[names(rcp_color_vec) == "beverage"] <- "#fde4cf"
rcp_color_vec[names(rcp_color_vec) == "breakfast"] <- "#ffcfd2"
rcp_color_vec[names(rcp_color_vec) == "dessert"] <- "#f1c0e8"
rcp_color_vec[names(rcp_color_vec) == "entree"] <- "#cfbaf0"
rcp_color_vec[names(rcp_color_vec) == "salad"] <- "#a3c4f3"
rcp_color_vec[names(rcp_color_vec) == "side"] <- "#90dbf4"
rcp_color_vec[names(rcp_color_vec) == "soup-stew"] <- "#8eecf5"

rcp_nodes <- sg_make_nodes(n = nrow(df_rcp))
rcp_nodes$id <- df_rcp$id
rcp_nodes$label <- df_rcp$name
rcp_nodes$size <- df_rcp$freq
rcp_nodes$color <- df_rcp$category
rcp_nodes <- rcp_nodes |>
  mutate(color = rcp_color_vec[as.character(color)])

nodes <- ig_nodes |>
  bind_rows(rcp_nodes)

## edges

edges <- fromJSON("data_for_viz/01-network/edges.json") |>
  as_tibble() |>
  mutate(id = seq(nrow(edges)))

sigmajs() |>
  sg_force() |>
  sg_nodes(nodes, id, label, size, color) |>
  sg_edges(edges, id, source, target) |>
  sg_layout(FALSE, igraph::layout_in_circle) |>
  sg_neighbours() |>
  sg_force_stop(5000)
