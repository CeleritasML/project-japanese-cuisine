gc()
rm(list = ls())

# 2022-04-09
# Rui Qiu (rq47)

if (!require("pacman")) install.packages("pacman")
pacman::p_load(tidyverse, leaflet, geojsonio, htmltools, htmlwidgets)

m <- leaflet() |>
  setView(lng = 122.14, lat = 37.42, zoom = 3)

dishes <- read_csv("data_for_viz/02-map/international-dishes.csv") |>
  mutate(
    name = str_replace(name, "United States", "USA"),
    name = str_replace(name, "Korea, Republic Of", "South Korea")
  )

world <- geojson_read("data_for_viz/02-map/unwrapped-d3/world-110m.geojson", what = "sp")

joined_df <- tibble(
  name = world$name
) |>
  left_join(dishes, by = "name") |>
  select(-code) |>
  replace_na(list(total = 0))

world$total <- joined_df$total

m <- leaflet(world) |>
  setView(lng = 0, lat = 0, zoom = 1.1) |>
  addProviderTiles(providers$CartoDB.Positron, options = providerTileOptions(noWrap = TRUE))

bins <- c(0, 1, 5, 10, 25, 50, 75, Inf)
pal <- colorBin("OrRd", domain = world$total, bins = bins)

labels <- sprintf(
  "<strong>%s</strong><br/>%g dishes",
  world$name, world$total
) |>
  lapply(HTML)

tag.map.title <- tags$style(HTML("
  .leaflet-control.map-title {
    transform: translate(-50%,20%);
    position: fixed !important;
    left: 50%;
    text-align: center;
    padding-left: 10px;
    padding-right: 10px;
    font-weight: bold;
    font-size: 18px;
    font-family: Roboto Mono;
  }
"))

title <- tags$div(
  tag.map.title, HTML("Foreign Origins of Japanese Dishes")
)

m <- m |>
  addPolygons(
    fillColor = ~ pal(total),
    weight = 1,
    opacity = 0.8,
    color = "#D4DADC",
    dashArray = "",
    fillOpacity = 0.7,
    highlightOptions = highlightOptions(
      weight = 2,
      color = "#4D6059",
      dashArray = "2",
      fillOpacity = 0.7,
      bringToFront = TRUE
    ),
    label = labels,
    labelOptions = labelOptions(
      style = list(
        "font-weight" = "normal",
        "padding" = "3px 8px",
        "font-family" = "Roboto Mono"
      ),
      textsize = "14px",
      direction = "auto"
    )
  ) |>
  addLegend(
    pal = pal,
    values = ~total,
    opacity = 0.7,
    title = NULL,
    position = "bottomleft"
  ) |>
  addPopups(137.14, 37.42, paste(
    sep = "<br/>",
    "Out of <b>726</b> recipes,",
    "<b>113</b> have foreign origins."
  ),
  options = popupOptions(
    closeButton = FALSE,
    style = list(
      "font-family" = "Roboto Mono",
      "font-size" = "12px"
    )
  )
  ) |>
  addControl(title,
    position = "topleft",
    className = "map-title"
  )

saveWidget(m, file = "data_for_viz/02-map/02-map.html")
