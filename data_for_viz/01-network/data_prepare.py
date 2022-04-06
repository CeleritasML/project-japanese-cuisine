import json
import os
from collections import defaultdict

import pandas as pd

# load synonym table

df = pd.read_csv('synonym.csv')
synonym = {}
for idx, row in df.iterrows():
    synonym[row['origin text']] = row['synonym']


path = '../../data'

json_names = []

for dirpath, dirnames, filenames in os.walk(path):
    for filename in filenames:
        json_names.append(os.path.join(dirpath, filename))

recipes = []
ingredients = []
links = []

ing_counter = defaultdict(int)

for name in json_names:
    with open(name, 'r') as f:
        j = json.load(f)
        ings = j['ingredients']
        for i in j['ingredients']:
            i_name_clean = i['name'].replace(' ', '')
            if i_name_clean in synonym:
                i_name_clean = synonym[i_name_clean]
            # count ingredient occurrence
            ing_counter[i_name_clean] += 1

# add nodes
for name in json_names:
    with open(name, 'r') as f:
        j = json.load(f)
        rec = j['name']
        ings = j['ingredients']
        # add recipe node
        recipes.append({'type': 'recipe',
                        'id': f'r_{rec}',
                        'name': rec,
                        'freq': len(ings)})
        for i in j['ingredients']:
            i_name_clean = i['name'].replace(' ', '')
            if i_name_clean in synonym:
                i_name_clean = synonym[i_name_clean]
            freq = ing_counter[i_name_clean]
            # if occurrence too low, skip
            if freq < 3:
                continue
            # add recipe-ingredient edge
            links.append({'source': f'i_{i_name_clean}', 'target': f'r_{rec}', 'value': 1})

# add ingredient node
for name, freq in ing_counter.items():
    if freq < 3:
        continue
    ingredients.append({'type': 'ingredient',
                        'id': f'i_{name}',
                        'name': name,
                        'freq': freq})

# save arrays
with open('recipe_nodes.json', 'w') as f:
    json.dump(recipes, f, indent=4)
with open('ingredient_nodes.json', 'w') as f:
    json.dump(ingredients, f, indent=4)
with open('edges.json', 'w') as f:
    json.dump(links, f, indent=4)
