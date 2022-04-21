# 2022-04-20
# Rui Qiu (rq47)

gc()
rm(list=ls())

if (!require("pacman")) install.packages("pacman")
pacman::p_load(tidyverse, sigmajs, jsonlite)

# nodes

df_ing <- fromJSON("data_for_viz/01-network/ingredient_nodes.json") |>
  as_tibble(validate = FALSE) |>
  mutate(grp = case_when(category == "condiment (powder)" ~ 1,
                         category == "condiment (bulk)" ~ 2,
                         category == "condiment (liquid)" ~ 3,
                         category == "protein" ~ 4,
                         category == "vegetable" ~ 5,
                         category == "fruit" ~ 6,
                         category == "mushroom/fungus" ~ 7,
                         category == "carbonhydrates" ~ 8,
                         category == "processed food" ~ 9,
                         category == "beverage" ~ 10))

ing_color_vec <- rep("black", length(unique(df_ing$category)))
names(ing_color_vec) <- unique(df_ing$category)
ing_color_vec[names(ing_color_vec) == "condiment (powder)"] <- "#046ED7"
ing_color_vec[names(ing_color_vec) == "condiment (bulk)"] <- "#0466C8"
ing_color_vec[names(ing_color_vec) == "condiment (liquid)"] <- "#023E7D"
ing_color_vec[names(ing_color_vec) == "protein"] <- "#002855"
ing_color_vec[names(ing_color_vec) == "vegetable"] <- "#001845"
ing_color_vec[names(ing_color_vec) == "fruit"] <- "#001233"
ing_color_vec[names(ing_color_vec) == "mushroom/fungus"] <- "#33415C"
ing_color_vec[names(ing_color_vec) == "carbonhydrates"] <- "#5C677D"
ing_color_vec[names(ing_color_vec) == "processed food"] <- "#7D8597"
ing_color_vec[names(ing_color_vec) == "beverage"] <- "#979DAC"
ing_color_vec[names(ing_color_vec) == "other"] <- "#A8ADBA"

ing_nodes <- sg_make_nodes(n = nrow(df_ing))
ing_nodes$id <- df_ing$id
ing_nodes$label <- df_ing$name
# ing_nodes$size <- 2*log(df_ing$freq)
ing_nodes$size <- df_ing$freq
ing_nodes$color <- df_ing$category
ing_nodes$grp <- df_ing$grp
ing_nodes <- ing_nodes |>
  mutate(color = ing_color_vec[as.character(color)])

df_rcp <- fromJSON("data_for_viz/01-network/recipe_nodes.json") |>
  as_tibble(validate = FALSE) |>
  mutate(grp = case_when(category == "other" ~ 11,
                         category == "appetizer" ~ 12,
                         category == "beverage" ~ 13,
                         category == "breakfast" ~ 14,
                         category == "dessert" ~ 15,
                         category == "entree" ~ 16,
                         category == "salad" ~ 17,
                         category == "side" ~ 18,
                         category == "soup-stew" ~ 19))

rcp_color_vec <- rep("black", length(unique(df_rcp$category)))
names(rcp_color_vec) <- unique(df_rcp$category)
rcp_color_vec[names(rcp_color_vec) == "appetizer"] <- "#f94144"
rcp_color_vec[names(rcp_color_vec) == "beverage"] <- "#f3722c"
rcp_color_vec[names(rcp_color_vec) == "breakfast"] <- "#f8961e"
rcp_color_vec[names(rcp_color_vec) == "dessert"] <- "#f9c74f"
rcp_color_vec[names(rcp_color_vec) == "entree"] <- "#90be6d"
rcp_color_vec[names(rcp_color_vec) == "salad"] <- "#6ab47c"
rcp_color_vec[names(rcp_color_vec) == "side"] <- "#43aa8b"
rcp_color_vec[names(rcp_color_vec) == "soup-stew"] <- "#577590"

rcp_nodes <- sg_make_nodes(n = nrow(df_rcp))
rcp_nodes$id <- df_rcp$id
rcp_nodes$label <- df_rcp$name
# rcp_nodes$size <- 0.5*df_rcp$freq
rcp_nodes$size <- df_rcp$freq
rcp_nodes$color <- df_rcp$category
rcp_nodes$grp <- df_rcp$grp
rcp_nodes <- rcp_nodes |>
  mutate(color = rcp_color_vec[as.character(color)])

nodes <- ing_nodes |>
  bind_rows(rcp_nodes)

## edges

edges <- fromJSON("data_for_viz/01-network/edges.json") |>
  as_tibble()
edges <- edges |>
  mutate(id = seq(nrow(edges)),
         color = rep("#DDDDDD", nrow(edges)))

# sigmajs() |>
#   sg_nodes(nodes, id, label, size, color) |>
#   sg_edges(edges, id, source, target, color) |>
#   sg_layout(FALSE, igraph::layout_as_bipartite,
#             types = c(rep(TRUE, nrow(ing_nodes)),
#                       rep(FALSE, nrow(rcp_nodes))),
#             vgap = 200,
#             maxiter = 1500) |>
#   sg_neighbours() |>
#   sg_drag_nodes() |>
#   sg_relative_size()
# 
# sigmajs() |>
#   sg_nodes(nodes, id, label, size, color) |>
#   sg_edges(edges, id, source, target, color) |>
#   sg_layout(FALSE, igraph::layout_with_kk) |>
#   sg_neighbours()
# 
# sigmajs() |>
#   sg_nodes(nodes, id, label, size, color) |>
#   sg_edges(edges, id, source, target, color) |>
#   sg_layout(FALSE, igraph::layout_with_fr) |>
#   sg_neighbours() |>
#   sg_drag_nodes() |>
#   sg_relative_size()
# 
# sigmajs() |>
#   sg_nodes(nodes, id, label, size, color) |>
#   sg_edges(edges, id, source, target, color) |>
#   sg_layout(directed = FALSE, igraph::layout_as_tree,
#             circular = TRUE) |>
#   sg_neighbours() |>
#   sg_drag_nodes() |>
#   sg_relative_size()

remotes::install_github('JohnCoene/grapher', dependencies = c("Depends", "Imports"))
library(grapher)

# nodes: id, label, size, color
# edges: source, target, weight(1), hidden(FALSE)

grapher_data <- list(nodes = nodes, links = tibble(
  source = edges$source,
  target = edges$target,
  weight = rep(0.1, nrow(edges)),
  hidden = rep(FALSE, nrow(edges))
))


graph(grapher_data) |>
  graph_background("#d3d3d3", .2) |>
  graph_layout_live(gravity = -3,
                    theta = 1,
                    drag_coeff = 0.5,
                    is_3d = FALSE) |>
  graph_layout_stable(ms = 5000) |>
  scale_node_color(color, palette = graph_palette_light()) |>
  scale_node_size(size)
