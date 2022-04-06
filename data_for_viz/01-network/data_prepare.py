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

ing_counter = defaultdict(int)
all_json = {}

# read everything to python object
for name in json_names:
    with open(name, 'r') as f:
        j = json.load(f)
        ings_cleaned = []
        for i in j['ingredients']:
            i_name_clean = i['name'].replace(' ', '')
            if i_name_clean in synonym:
                i_name_clean = synonym[i_name_clean]
            ings_cleaned.append(i_name_clean)
        ings_cleaned = set(ings_cleaned)
        # count ingredient occurrence
        for i in ings_cleaned:
            ing_counter[i] += 1
        all_json[j['name']] = ings_cleaned

recipes = []
ingredients = []
links = []

for rec, ings in all_json.items():
    # only keep ingredients with more than 3 occurrence
    ings = [i for i in ings if ing_counter[i] >= 3]
    if len(ings) == 0:
        continue
    recipes.append({'type': 'recipe',
                    'id': f'r_{rec}',
                    'name': rec,
                    'freq': len(ings)})
    for i in ings:
        links.append({'source': f'i_{i}', 'target': f'r_{rec}', 'value': 1})

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

single_json = {
    'recipes': recipes,
    'ingredients': ingredients,
    'links': links
}
with open('data.json', 'w') as f:
    json.dump(single_json, f, indent=4)

with open('data_no_indent.json', 'w') as f:
    json.dump(single_json, f)
