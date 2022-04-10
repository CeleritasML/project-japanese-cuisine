if (!require("pacman")) install.packages("pacman")
pacman::p_load(tidyverse, jsonlite, here)

categories <- dir("data/")

# create an empty tibble

ingredients <- c()

# loop through all sub-directory to read json files and extract
# required information

for (i in categories) {
  for (j in dir(paste0("data/", i))) {
    dat <- fromJSON(paste0("data/", i, "/", j))
    ingredients <- c(ingredients, dat$ingredients$name)
  }
}

ing_df <- tibble(name = ingredients) |>
  group_by(name) |>
  summarize(freq = n()) |>
  arrange(desc(freq)) |>
  top_n(50)

ing_df <- ing_df |>
  mutate(origin = case_when(
    name %in% c("dashi", "sake", "mirin",
                "cooked Japanese short-grain rice",
                "daikon radish", "shiso leaves",
                "kombu", "panko", "katsuobushi",
                "shichimi togarashi", "shiitake mushrooms",
                "uncooked Japanese short-grain rice",
                "Japanese mayonnaise", "matcha", "Tokyo negi",
                "shimeji mushrooms") ~ "japanese exclusive",
    name %in% c("roasted sesame oil", "soy sauce", "ginger",
                "rice vinegar", "green onion/scallion",
                "dashi", "green onions/scallions") ~ "asian",
    TRUE ~ "common"
  ))

ing_df |>
  filter(origin == "japanese exclusive")

write_csv(ing_df, "ingredients-by-freq.csv")

# On Google Trends, use top 4 Japanese exclusive ingredients as search terms:

# - Mirin
# - Sake (Alcoholic beverages)
# - Daikon (Radish)
# - Dashi (Food)

# Filter by United States, 2004-present, Food & Drink (category), the "Interest over time" is a value relative to search interest on google. A value of 100 is the peak popularity.

# What we want to show here is that although the relative popularity of Japanese ingredients are low, people start to pay more attention to the origin exclusive ingredients for more authentic foreign cusines in the States.

# data is saved as google-trends-popularity.csv

# todo:

# 1. d3 horizontal bar plot of top 50 ingredients, use 3 colors to highlight origins
# 2. d3 stacked bar plot to show the increase of pop in 4 selected ingredients


