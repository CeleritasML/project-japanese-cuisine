if (!require("pacman")) install.packages("pacman")
pacman::p_load(tidyverse, jsonlite, here)

# helper function to get list of ingredients from category
get_ingredients <- function(category_name){
  # initialize ingredients
  ingredients_list <- c() 
  
  category_dir = dir(paste0("data/", category_name))
  for (dish in category_dir){
    dat <- fromJSON(paste0("data/", category_name, "/", dish))
    name_list = dat$ingredients$name
    
    for (i in length(name_list)){
      if(name_list[[i]] == "green onions/scallions"){
        name_list[[i]] = "green onion/scallion"
      }
      
      if(name_list[[i]] %in% c("uncooked Japanese short-grain rice", "cooked Japanese short-grain rice")){
        name_list[[i]] = "Japanese short-grain rice"
      }
    }
    
    ingredients_list <- c(ingredients_list, name_list)
  }
  
  return(ingredients_list)
}


# helper function to get dataframe of ingredient frequencies by category
get_dataframe <- function(category_name){
  
  ingredients = get_ingredients(category_name)
  
  ing_df <- tibble(name = ingredients) |>
    group_by(name) |>
    summarize(freq = n()) |>
    arrange(desc(freq)) |>
    head(20)
  
  ing_df <- ing_df |>
    mutate(origin = case_when(
      name %in% c("sake", "mirin", "dashi",
                  "daikon radish", "shiso leaves", "shichimi togarashi",
                  "shokupan", "matcha", "cooked Japanese short-grain rice",
                  "uncooked Japanese short-grain rice", "miso", "kombu",
                  "katsuobushi", "Tokyo negi", "shiitake mushrooms"
                  ) ~ "japanese exclusive", 
      
      
      name %in% c("soy sauce", "green onion/scallion", "ginger",
                  "roasted sesame oil", "toasted white sesame seeds", "rice vinegar",
                  "red bean paste", "green onions/scallions", "dried red chili pepper",
                  "napa cabbage"
                  ) ~ "general asian",
      
      TRUE ~ "others"
  ))
  
  ing_df$category = category_name
  
  return(ing_df)
} 

categories <- c("appetizer",
                "breakfast",
                "dessert",   
                "entree", 
                "side", 
                "salad",
                "soup-stew")

data = get_dataframe(categories[[1]])

for (i in 2:6){
  temp = get_dataframe(categories[[i]])
  data = rbind(data, temp)
}

data$name[data$name %in% c("cooked Japanese short-grain rice", "uncooked Japanese short-grain rice")] = "Japanese short-grain rice"

J = data |> filter(origin == 'japanese exclusive')
unique(J$name)

write_csv(data, "data_for_viz/05-barplot/ingredients-by-freq.csv")

