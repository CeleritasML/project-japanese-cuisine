"""
This file generates the fifth visualization 05-barplot. 
"""

library(tidyverse)
library(plotly)
library(htmlwidgets)


setwd('./data_for_viz/05-barplot/')
dat1 = read_csv('ingredients-by-freq.csv')
dat2 = read_csv('google-trends-popularity.csv')

dat1$origin = as.factor(dat1$origin)

dat1$name = as.factor(dat1$name)
dat1$name = reorder(dat1$name, dat1$freq)

f1 = dat1 |>
  plot_ly(
        x = ~name,
        y = ~freq,
        type = 'bar',
        name = ~origin
        ) |>
  layout(title = 'What are the most used ingredients in Japanese entree recipes?',
         xaxis = list(title = 'Name of recipe'),
         yaxis = list(title = 'Number of Occurences in Entree Recipes'))

saveWidget(f1, "05-barplot.html", selfcontained = T, libdir = "lib")

### TODO: 
# dat2 contains time-series data on each of the ingredients
# The time-series data can be reduced down to statistical visualizations such as boxplot or violin plot
# The statistical visualization will be put underneath the current plot, the relative position of the violins/boxes 
# will reveal whether there is a correlation between:
# how frequently ingredients appear in a japanese recipe vs how much an ingredient is searched on google
