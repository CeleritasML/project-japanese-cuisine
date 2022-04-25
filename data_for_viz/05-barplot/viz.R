"""
This file generates the fifth visualization 05-barplot. 
"""

library(tidyverse)
library(plotly)
library(htmlwidgets)


setwd('./data_for_viz/05-barplot/')
dat1 = read_csv('ingredients-by-freq.csv')
dat2 = read_csv('japan-timelines.csv')

dat2 = dat2 |> 
  select(-Week) |>
  pivot_longer(cols = everything(),
               names_to = 'name',
               values_to = 'clicks')

dat1$name <- reorder(dat1$name, dat1$freq)
dat2$name = factor(dat2$name, levels = levels(dat1$name))

fig1 <- dat1 |> plot_ly(x = ~name, y = ~freq, type = 'bar', name = ~origin) 
fig2 <- dat2 |> plot_ly(x = ~name, y = ~clicks, type = "box")

fig <- subplot(fig1, fig2, nrows = 2, shareX = TRUE) %>% 
  layout(title = list(text = "What are the most used ingredients in Japanese entree recipes?"),
         plot_bgcolor='#e5ecf6', 
         xaxis = list( 
           zerolinecolor = '#ffff', 
           zerolinewidth = 2, 
           gridcolor = 'ffff'), 
         yaxis = list( 
           zerolinecolor = '#ffff', 
           zerolinewidth = 2, 
           gridcolor = 'ffff')) 
fig



saveWidget(fig, "05-barplot.html", selfcontained = T, libdir = "lib")

### TODO: 
# dat2 contains time-series data on each of the ingredients
# The time-series data can be reduced down to statistical visualizations such as boxplot or violin plot
# The statistical visualization will be put underneath the current plot, the relative position of the violins/boxes 
# will reveal whether there is a correlation between:
# how frequently ingredients appear in a japanese recipe vs how much an ingredient is searched on google
