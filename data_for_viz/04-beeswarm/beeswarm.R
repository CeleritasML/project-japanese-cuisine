library(r2d3)
library(tidyverse)

df <- read_csv("nutrition.csv")

viz <- r2d3(data = df, script = "beeswarm_d3.js")
save_d3_html(viz, "04-beeswarm.html")

