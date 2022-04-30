gc()
rm(list = ls())

# 2022-04-09
# Rui Qiu (rq47)

# package requirements

if (!require("pacman")) install.packages("pacman")
pacman::p_load(
  tidyverse, leaflet,
  geojsonio, htmltools, htmlwidgets
)

setwd(dirname(rstudioapi::getActiveDocumentContext()$path))

# load previously scraped and cleaned data, replace country names to match
# the geojson file from topoJSON

dishes <- read_csv("international-dishes.csv") |>
  mutate(
    name = str_replace(name, "United States", "USA"),
    name = str_replace(name, "Korea, Republic Of", "South Korea")
  )

world <- geojson_read("world-110m.geojson", what = "sp")

# join two tables together for map drawing

joined_df <- tibble(
  name = world$name
) |>
  left_join(dishes, by = "name") |>
  select(-code) |>
  replace_na(list(total = 0))

world$total <- joined_df$total

# plot the basis of the map with tiles

m <- leaflet(world,
  options = leafletOptions(
    zoomControl = FALSE,
    minZoom = 2.0,
    maxZoom = 2.0
  )
) |>
  setView(lng = 0, lat = 0, zoom = 1.5) |>
  setMaxBounds(
    lng1 = -180, lat1 = -90,
    lng2 = 180, lat2 = 90
  ) |>
  addProviderTiles(providers$CartoDB.Positron, options = providerTileOptions(noWrap = FALSE))

# manually set the discrete palette

bins <- c(0, 1, 5, 10, 25, 50, 75, Inf)
mypalette <- colorBin("OrRd", domain = world$total, bins = bins)

# create labels

labels <- sprintf(
  "<strong>%s</strong><br/>%g dishes",
  world$name, world$total
) |>
  lapply(HTML)

# add title style

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
    fillColor = ~ mypalette(total),
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
    colors = mypalette(bins)[1:7],
    values = ~total,
    labels = c("0", "1-5", "6-10", "11-25", "26-50", "51-75", "76+"),
    opacity = 0.7,
    title = NULL,
    position = "bottomleft"
  ) |>
  addPopups(137.14, 67.42, paste(
    sep = "<br/>",
    "Out of <b>726</b> recipes,",
    "<b>113</b> have foreign origins."
  ),
  options = labelOptions(
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

m

saveWidget(m, file = "02-map.html")

setwd("../../")
