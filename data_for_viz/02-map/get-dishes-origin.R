# Rui Qiu (rq47)
# 2022-04-07

if (!require("pacman")) install.packages("pacman")
pacman::p_load(tidyverse, jsonlite, here)

categories <- dir("data/")

# create an empty tibble

dishes <- tibble(
  name = character(),
  origin = character(),
  category = character()
)

# loop through all sub-directory to read json files and extract
# required information

for (i in categories) {
  for (j in dir(paste0("data/", i))) {
    dat <- fromJSON(paste0("data/", i, "/", j))
    dishes <- dishes |>
      add_row(
        name = dat$name,
        origin = dat$cuisine,
        category = i
      )
  }
}

# group by and summarize to calculate the total number of dishes from
# countries other than Japan itself

international_dishes <- dishes |>
  group_by(origin) |>
  summarize(total = n()) |>
  filter(!origin %in% c("Japanese", "Other")) |>
  arrange(desc(total))
  
# add two new columns based on the origin (which are adjectives),
# we might need country name and shortcode to match the country
# information in geojson file

international_dishes |>
  mutate(name = c("United States", "Korea, Republic Of",
                  "China", "France", "Italy", "Philippines",
                  "Thailand", "India", "Mexico", "Taiwan"),
         code = c("USA", "KOR", "CHN", "FRA", "ITA", "PHL",
                  "THA", "IND", "MEX", "TWN")) |>
  relocate(name, total, code) |>
  select(-origin) |>
  write_csv("data_for_viz/02-map/international-dishes.csv")

# the followings are pretty much the same, except the data
# are group by both origin and category.

international_dishes_cat <- dishes |>
  group_by(origin, category) |>
  summarize(total = n()) |>
  filter(!origin %in% c("Japanese", "Other")) |>
  arrange(desc(total))

# another difference is we might need the data to be in a wide for later
# use

international_dishes_cat |>
  pivot_wider(names_from = category,
              values_from = total,
              values_fill = 0) |>
  mutate(
    name = case_when(origin == "American" ~ "United States",
                     origin == "Korean" ~ "Korea, Republic Of",
                     origin == "French" ~ "France",
                     origin == "Italian" ~ "Italy",
                     origin == "Chinese" ~ "China",
                     origin == "Filipino" ~ "Philippines",
                     origin == "Indian" ~ "India",
                     origin == "Mexican" ~ "Mexico",
                     origin == "Taiwanese" ~ "Taiwan",
                     origin == "Thai" ~ "Thailand"),
    code = case_when(origin == "American" ~ "USA",
                     origin == "Korean" ~ "KOR",
                     origin == "French" ~ "FRA",
                     origin == "Italian" ~ "ITA",
                     origin == "Chinese" ~ "CHN",
                     origin == "Filipino" ~ "PHL",
                     origin == "Indian" ~ "IND",
                     origin == "Mexican" ~ "MEX",
                     origin == "Taiwanese" ~ "TWN",
                     origin == "Thai" ~ "THA")
  ) |>
  ungroup() |>
  select(-origin) |>
  relocate(c(name, code)) |>
  write_csv("data_for_viz/02-map/international-dishes-cat.csv")
