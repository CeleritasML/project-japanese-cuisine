###
### This file generates the fifth visualization 05-barplot.
###

if (!require("pacman")) install.packages("pacman")
pacman::p_load(tidyverse, plotly, htmlwidgets)

setwd(dirname(rstudioapi::getActiveDocumentContext()$path))

dat1 <- read_csv("ingredients-by-freq.csv")
dat2 <- read_csv("japan-timelines.csv")

dat2 <- dat2 |>
  select(-Week) |>
  pivot_longer(
    cols = everything(),
    names_to = "name",
    values_to = "clicks"
  )

dat1$name <- reorder(dat1$name, dat1$freq)
dat2$name <- factor(dat2$name, levels = levels(dat1$name))

dat2$origin <- "Japanese exclusive"

generate_plot <- function() {
  fig1 <- dat1 |>
    plot_ly(
      x = ~name, y = ~freq, type = "bar", name = ~origin, color = ~origin,
      colors = c("#f9c74f", "#577590", "#d3d3d3")
    ) |>
    layout()

  fig2 <- dat2 |>
    plot_ly(
      x = ~name, y = ~clicks, type = "box", showlegend = F, color = ~origin,
      colors = "#577590"
    ) |>
    layout()

  fig <- subplot(fig1, fig2, nrows = 2, shareX = TRUE) %>%
    layout(
      hovermode = "x unified",
      title = list(
        text = "<b>A comparison: most recurring ingredients in Japanese recipes vs Google search rates</b>",
        xanchor = "center",
        pad = list(b = 5, l = 5, r = 5, t = 5),
        font = list(family = "Roboto Mono, monospace", size = 20)
      ),
      plot_bgcolor = "#fffff8",
      paper_bgcolor = "#fffff8",
      legend = list(
        title = list(text = "Ingredient Category"),
        bgcolor = "#fffff8",
        bordercolor = "#000",
        groupclick = "toggleitem",
        xanchor = "left",
        yanchor = "top",
        x = 0.05,
        y = 0.95,
        font = list(family = "Roboto Mono, monospace")
      ),
      xaxis = list(
        title = "",
        zerolinecolor = "#111111",
        zerolinewidth = 2,
        gridcolor = "#fffff8",
        titlefont = list(family = "Roboto Mono, monospace", size = 14),
        tickfont = list(family = "Roboto Mono, monospace", size = 14)
      ),
      yaxis = list(
        zerolinecolor = "#111111",
        zerolinewidth = 2,
        gridcolor = "#fffff8",
        titlefont = list(family = "Roboto Mono, monospace", size = 14),
        tickfont = list(family = "Roboto Mono, monospace", size = 14)
      ),
      margin = list(l = 50, r = 50, b = 100, t = 100, pad = 4),

      # subplot titles
      annotations = list(
        list( # top plot
          x = 0.5,
          y = 1.05,
          text = "",
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
          showarrow = FALSE,
          font = list(family = "Roboto Mono, monospace", size = 18)
        ),
        list(
          x = 0.5,
          y = 0.45,
          text = "Boxplot of weekly search rate of Japanese-exclusive ingredients from 2017 to 2022 in the U.S.",
          xref = "paper",
          yref = "paper",
          xanchor = "center",
          yanchor = "bottom",
          showarrow = FALSE,
          font = list(family = "Roboto Mono, monospace", size = 18)
        )
      ) # end of subplot titles
    ) # end of `layout` configurations

  saveWidget(fig, "05-barplot.html", selfcontained = T, libdir = "lib")
}

generate_plot()

# Manually Add a line of html in the generated 05-barplot.html
# for the edge case that incorrect font in iframe is loaded.

# <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto Mono:300,400,600,700" />

setwd("../../")