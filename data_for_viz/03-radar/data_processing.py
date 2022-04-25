#!/usr/bin/env python
# coding: utf-8
# Author: Chao Li

# # Data processing

# Packages
import pandas as pd
import json
from os import walk


# Create a function to read all the recipes
def collect_ind(sub_class):
    # file names list
    filenames = next(walk(f"../../data/{sub_class}"), (None, None, []))[
        2
    ]  # [] if no file

    # obtain all the ingredients
    ind_all = []
    for i in range(len(filenames)):
        recipe = filenames[i]
        # read file
        with open(f"../../data/{sub_class}/{recipe}", "r") as myfile:
            rec = myfile.read()
        js_rec = json.loads(rec)
        ind_all += js_rec["ingredients"]

    # transfer to the pandas data frame
    ind_all = pd.DataFrame(ind_all).rename(columns={"name": "ingredients"})

    return ind_all


# create the function to match the condiment class to all the ingredients
def count_condiment(data, name):
    # data handling
    data = (
        pd.DataFrame(data.ingredients.value_counts())  # calculate the ingredients for each class
            .reset_index(drop=False)  # keep the index as the column
            .rename(columns={"index": "ingredients", "ingredients": name})
            .merge(ind_class, on="ingredients", how="left")  # match the ingredients class
            .fillna("condiments(exclusive)")  # combine all the special condiments
            .drop("ingredients", axis=1)
    )

    # tidy the dataset
    data = (
        pd.DataFrame(data.type.value_counts())
            .reset_index(drop=False)
            .rename(columns={"index": "type", "type": name})
    )
    return data


# read the ingredient class
ind_class = pd.read_excel("503-ingredients.xlsx")
# melt the data for plotting
ind_class = ind_class.melt(value_name="ingredients", var_name="type")
ind_class = ind_class.dropna()
with open("all_ingredients.txt") as file:
    lines = file.readlines()

# eval(lines[0])
# data = []

# for i in lines:
#     data.append(eval(i))
# data = pd.DataFrame(data,columns=['ingredients','counts'])
# data = data.merge(ind_class,on = 'ingredients',how = 'left')
# data = data.fillna('condiments(exclusive)')

appetizer = collect_ind("appetizer")
beverage = collect_ind("beverage")
breakfast = collect_ind("breakfast")
dessert = collect_ind("dessert")
entree = collect_ind("entree")
salad = collect_ind("salad")
side = collect_ind("side")
soup_stew = collect_ind("soup-stew")

appetizer = count_condiment(appetizer, "appetizer")
beverage = count_condiment(beverage, "beverage")
breakfast = count_condiment(breakfast, "breakfast")
dessert = count_condiment(dessert, "dessert")
entree = count_condiment(entree, "entree")
salad = count_condiment(salad, "salad")
side = count_condiment(side, "side")
soup_stew = count_condiment(soup_stew, "soup_stew")

data = appetizer.merge(beverage, how="outer", on="type")
data = data.merge(breakfast, how="outer", on="type")
data = data.merge(dessert, how="outer", on="type")
data = data.merge(entree, how="outer", on="type")
data = data.merge(salad, how="outer", on="type")
data = data.merge(side, how="outer", on="type")
data = data.merge(soup_stew, how="outer", on="type")
data = data.fillna(0)

data.iloc[6, 0] = "carbohydrates"

data.to_csv("windrose.csv", index=False)
# # plotting

# plotting with plotly
import dash
from dash import dcc, html
import plotly.graph_objects as go
import plotly.express as px
from dash.dependencies import Input, Output

data = pd.read_csv("windrose.csv")

# normalize the data
data.iloc[:, 1:] = data.iloc[:, 1:] / data.iloc[:, 1:].sum()
data = data.drop(0)

import plotly.graph_objects as go

# create the figure object
fig = go.Figure()

# add plots
fig.add_trace(
    go.Scatterpolar(
        r=data["appetizer"], theta=data["type"], fill="toself", name="appetizer"
    )
)
fig.add_trace(
    go.Scatterpolar(
        r=data["breakfast"], theta=data["type"], fill="toself", name="breakfast"
    )
)
fig.add_trace(
    go.Scatterpolar(
        r=data["beverage"], theta=data["type"], fill="toself", name="beverage"
    )
)
fig.add_trace(
    go.Scatterpolar(
        r=data["dessert"], theta=data["type"], fill="toself", name="dessert"
    )
)
fig.add_trace(
    go.Scatterpolar(r=data["entree"], theta=data["type"], fill="toself", name="entree")
)
fig.add_trace(
    go.Scatterpolar(r=data["salad"], theta=data["type"], fill="toself", name="salad")
)
fig.add_trace(
    go.Scatterpolar(
        r=data["soup_stew"], theta=data["type"], fill="toself", name="soup_stew"
    )
)

# figure layout
fig.update_layout(
    polar=dict(
        radialaxis=dict(
            visible=True,
            # range=[0, 1]
        )
    ),
    showlegend=True,
    template="ggplot2",
    title="Condiment radar plot of each subclass",
)

fig.show()
fig.write_html("windrose.html")
