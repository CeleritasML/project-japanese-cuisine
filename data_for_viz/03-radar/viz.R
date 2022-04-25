if (!require("pacman")) install.packages("pacman")
pacman::p_load(tidyverse, jsonlite, r2d3)

dat <- jsonlite::read_json('radar.json')

  viz <- r2d3(data = dat, script = "03-radar.js", viewer = "browser")
  save_d3_html(viz, file = "03-radar.html")

