if (!require("pacman")) install.packages("pacman")
pacman::p_load(tidyverse, jsonlite, r2d3)

dat <- read_csv("windrose.csv") |>
  filter(type!="condiments(exclusive)") |>
  rowwise() |>
  mutate(row_sum = sum(appetizer+beverage+breakfast+dessert+entree+salad+side+soup_stew)) |>
  mutate_at(2:9, ~ ./row_sum) |>
  select(-row_sum)

viz <- r2d3(data = dat, script = "03-radar.js", viewer = "browser")
save_d3_html(viz, file = "03-radar.html")

