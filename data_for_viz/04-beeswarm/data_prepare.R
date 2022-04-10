library(rjson)
library(rstudioapi)
library(tidyverse)
## This ensures the working directory to change to where the code file is.
setwd(dirname(rstudioapi::getActiveDocumentContext()$path))

folders <- list.files(path = "../../data", full.names = F)
df <- data.frame(matrix(ncol = 7, nrow = 0))
x <- c("id","name", "type", "nutrition", "value", "unit")
colnames(df) <- x
links <- data.frame(matrix(ncol = 4, nrow = 0))
y <- c("source","target","value")
colnames(links) <- y
interested_nutritions <- c("Calories","Protein","Sodium", "Potassium","Calcium")
recipes_available <- 0
for (folder in folders) {
  files <- list.files(path = paste("../../data/", folder, sep = ""), full.names = T)
  for (file in files) {
    json_data <- fromJSON(file = file)
    id <- NULL
    dish_name <- NULL
    dish_type <- NULL
    nutrition <- NULL
    nutrition_value <- NULL
    nutrition_unit <- NULL
    link_source <- NULL
    link_target <- NULL
    link_value <- NULL
    if (length(json_data$nutrition) > 0) {
      all_nutritions <- c()
      for (i in seq_along(json_data$nutrition)) {
        all_nutritions <- append(all_nutritions,json_data$nutrition[[i]][[1]])
      }
      if(all(interested_nutritions %in% all_nutritions)){
        nutrition_index <- 1
        for (i in seq_along(json_data$nutrition)) {
          if(json_data$nutrition[[i]][[1]] %in% interested_nutritions) {
            id <- append(id,5*recipes_available+nutrition_index)
            dish_name <- append(dish_name, json_data$name)
            dish_type <- append(dish_type, folder)
            nutrition <- append(nutrition, json_data$nutrition[[i]][[1]])
            nutrition_value <- append(nutrition_value, json_data$nutrition[[i]][[2]])
            nutrition_unit <- append(nutrition_unit, json_data$nutrition[[i]][[3]])
            if(nutrition_index<5){
              link_source <- append(link_source, 5*recipes_available+nutrition_index)
              link_target <- append(link_target, 5*recipes_available+nutrition_index+1)
              link_value <- append(link_value, json_data$name)
            }
            nutrition_index <- nutrition_index + 1
          }
        }
        dish_df <- data.frame(id = id, name = dish_name, type = dish_type, nutrition = nutrition, value = nutrition_value, unit = nutrition_unit)
        dish_df$value <- as.numeric(dish_df$value)
        df <- rbind(df, dish_df)
        dish_links <- data.frame(source = link_source, target = link_target, value = link_value)
        links <- rbind(links, dish_links)
        recipes_available <- recipes_available + 1
      }
    }
  }
}

outlier <- df[df$value == 69824,]$name
outlier_ids <- df[df$name == outlier,]$id
df_cleaned <- df[df$name != outlier,]
links <- links[!links$source %in% outlier_ids,]

recommended <- c(400, 10, 400, 700, 200)

df_final <- data.frame(matrix(ncol = 7, nrow = 0))
colnames(df_final) <- x
for (i in 1:5) {
  df_inter <- df_cleaned[df_cleaned$nutrition == interested_nutritions[i],]
  df_inter$value_level <- log(df_inter$value/recommended[i])
  df_final <- rbind(df_final, df_inter)
}
df_final <- df_final[order(df_final$id),]

df_final <- as_tibble(df_final)
write_csv(df_final, "nutrition.csv")
links <- as_tibble(links)
write_csv(links, "links.csv")
