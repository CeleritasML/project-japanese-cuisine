"""
This file generates the interactive visualization for 05-barplot. 
"""

import altair as alt
import pandas as pd

freq = pd.read_csv('ingredients-by-freq.csv')

freq.category = pd.Categorical(freq.category, ordered=True)  # make categories an ordered factor

# configuring dropdown bar
dropdown_selection = alt.binding_select(options=['appetizer',
                                                 'breakfast',
                                                 'dessert',
                                                 'entree',
                                                 'salad',
                                                 'side'],
                                        name='Recipe Category: ')

dropdown_selection_single = alt.selection_single(fields=['category'], bind=dropdown_selection)

alt.renderers.enable('altair_viewer')

alt.Chart(freq).mark_bar().encode(
    x=alt.X("name:O", sort='-y'),
    y='freq:Q',
    color='origin:N'
).transform_filter(  # apply filter by dropdown
    dropdown_selection_single
).add_selection(  # add dropdown selection
    dropdown_selection_single
).interactive()
