if (!require("pacman")) install.packages("pacman")
pacman::p_load(tidyverse, jsonlite, r2d3)

dat <- jsonlite::read_json("radar.json")

viz <- r2d3(data = dat, script = "data_for_viz/03-radar/03-radar.js", viewer = "browser")
save_d3_html(viz, file = "data_for_viz/03-radar/03-radar.html")
