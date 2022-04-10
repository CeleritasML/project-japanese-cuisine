if (!require("pacman")) install.packages("pacman")
pacman::p_load(tidyverse, jsonlite, r2d3)

dat <- jsonlite::read_json('data_no_indent.json')

viz <- r2d3(data = dat, script = "01-network.js", viewer = "browser")
save_d3_html(viz, file = "01-network.html")
