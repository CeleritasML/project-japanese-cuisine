library(r2d3)
library(tidyverse)
library(rstudioapi)
## This ensures the working directory to change to where the code file is.
setwd(dirname(rstudioapi::getActiveDocumentContext()$path))

df <- read_csv("nutrition.csv")
links <- read_csv("links.csv")
data_to_json <- function(data) {
  jsonlite::toJSON(data, dataframe = "rows", auto_unbox = FALSE, rownames = FALSE)
}

data <- list("nodes" = df, "links" = links)

viz <- r2d3(data = data_to_json(data), script = "beeswarm_d3.js")
save_d3_html(viz, "04-beeswarm.html")
