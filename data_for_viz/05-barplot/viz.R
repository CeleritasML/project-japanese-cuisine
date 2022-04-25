###
### This file generates the fifth visualization 05-barplot.
###

library(tidyverse)
library(plotly)
library(htmlwidgets)


setwd('./data_for_viz/05-barplot/')
dat1 <- read_csv('ingredients-by-freq.csv')
dat2 <- read_csv('japan-timelines.csv')

dat2 <- dat2 |>
  select(-Week) |>
  pivot_longer(cols = everything(),
               names_to = 'name',
               values_to = 'clicks')

dat1$name <- reorder(dat1$name, dat1$freq)
dat2$name <- factor(dat2$name, levels = levels(dat1$name))

dat2$origin <- 'Japanese exclusive'

generate_plot <- function(){
  fig1 <- dat1 |> 
    plot_ly(x = ~name, y = ~freq, type = 'bar', name = ~origin) |>
    layout() 
  
  fig2 <- dat2 |> 
    plot_ly(x = ~name, y = ~clicks, type = "box", showlegend = F) |>
    layout(title = list(text = "Weekly Click Rate Distributions over 5 Years"))
  
  fig <- subplot(fig1, fig2, nrows = 2, shareX = TRUE) %>% 
    layout(title = list(text = "A comparison: most recurring ingredients in Japanese recipes vs Google search rates",
                        xanchor = 'center',
                        pad = list(b = 5, l = 5, r = 5, t = 5)),
           
           plot_bgcolor='#e5ecf6', 
           
           legend = list(title = list(text = 'Ingredient Category'),
                         bgcolor = "#E2E2E2",
                         bordercolor = '#000',
                         groupclick = 'toggleitem',
                         xanchor = 'left',
                         yanchor = 'top',
                         x = 0.05,
                         y = 0.95),
           
           xaxis = list( 
             zerolinecolor = '#ffffff', 
             zerolinewidth = 2, 
             gridcolor = '#ffff'), 
           
           yaxis = list( 
             zerolinecolor = '#ffffff', 
             zerolinewidth = 2, 
             gridcolor = '#ffffff'),
           
           margin = list(l = 50, r = 50, b = 100, t = 100, pad = 4),
           
           # subplot titles
           annotations = list( 
             list( # top plot
               x = 0.5,  
               y = 1.05,  
               text = "Frequently recurring Japanese ingredients such as mirin, dashi rarely appear in Google searches, indicating low levels of public awareness.",  
               xref = "paper",  
               yref = "paper",  
               xanchor = "center",  
               yanchor = "bottom",  
               showarrow = FALSE 
             ),
             list( # top plot
               x = 0.5,  
               y = 0.97,  
               text = "Most recurrent ingredients in 500+ scraped authentic Japanese recipes",  
               xref = "paper",  
               yref = "paper",  
               xanchor = "center",  
               yanchor = "bottom",  
               showarrow = FALSE 
             ),  
             list( 
               x = 0.5,  
               y = 0.45,  
               text = "Boxplot of weekly search rate of Japanese-exclusive ingredients from 2017 to 2022 in the U.S.",  
               xref = "paper",  
               yref = "paper",  
               xanchor = "center",  
               yanchor = "bottom",  
               showarrow = FALSE 
             )) # end of subplot titles
           
    ) # end of `layout` configurations 
  
  saveWidget(fig, "05-barplot.html", selfcontained = T, libdir = "lib")
}

generate_plot()
