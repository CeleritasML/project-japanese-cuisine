library(rjson)
library(rstudioapi)
library(tidyverse)
## This ensures the working directory to change to where the code file is.
setwd(dirname(rstudioapi::getActiveDocumentContext()$path))

folders <- list.files(path = "../../data", full.names = F)
df <- data.frame(matrix(ncol = 5, nrow = 0))
x <- c("name", "type", "nutrition", "value", "unit")
colnames(df) <- x
for (folder in folders) {
  files <- list.files(path = paste("../../data/", folder, sep = ""), full.names = T)
  for (file in files) {
    json_data <- fromJSON(file = file)
    dish_name <- NULL
    dish_type <- NULL
    nutrition <- NULL
    nutrition_value <- NULL
    nutrition_unit <- NULL
    if (length(json_data$nutrition) > 0) {
      for (i in seq_along(json_data$nutrition)) {
        dish_name <- append(dish_name, json_data$name)
        dish_type <- append(dish_type, folder)
        nutrition <- append(nutrition, json_data$nutrition[[i]][[1]])
        nutrition_value <- append(nutrition_value, json_data$nutrition[[i]][[2]])
        nutrition_unit <- append(nutrition_unit, json_data$nutrition[[i]][[3]])
      }
      dish_df <- data.frame(name = dish_name, type = dish_type, nutrition = nutrition, value = nutrition_value, unit = nutrition_unit)
      dish_df$value <- as.numeric(dish_df$value)
      df <- rbind(df, dish_df)
    }
  }
}

interested_nutritions <- c("Sodium", "Calories", "Potassium", "Protein", "Calcium")
df_cleaned <- df[df$nutrition %in% interested_nutritions,]

df_cleaned <- df_cleaned[df_cleaned$value != 69824,]
df_final <- data.frame(matrix(ncol = 5, nrow = 0))
colnames(df_final) <- x
for (nutrition in interested_nutritions) {
  df_inter <- df_cleaned[df_cleaned$nutrition == nutrition,]
  df_inter$value_norm <- as.factor(scale(df_inter$value))
  df_final <- rbind(df_final, df_inter)
}

df_final <- as_tibble(df_final)
write_csv(df_final, "nutrition.csv")
