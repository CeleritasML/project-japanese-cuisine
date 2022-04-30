import json
import os
from collections import defaultdict

import pandas as pd

# load synonym table

df = pd.read_csv('synonym.csv')
synonym = {}
for idx, row in df.iterrows():
    synonym[row['origin text']] = row['synonym']

with open('category_synonym.json', 'r') as f:
    category_synonym = json.load(f)

path = '../../data'

recipe_categories = ['appetizer', 'beverage', 'breakfast', 'dessert', 'entree', 'salad', 'side', 'soup-stew']

json_names = {c: [] for c in recipe_categories}

for c in recipe_categories:
    for dirpath, dirnames, filenames in os.walk(os.path.join(path, c)):
        for filename in filenames:
            json_names[c].append(os.path.join(dirpath, filename))

ing_counter = defaultdict(int)
all_json = {}

# read everything to python object
for c, names in json_names.items():
    for name in names:
        with open(name, 'r') as f:
            j = json.load(f)
            ings_cleaned = []
            for i in j['ingredients']:
                i_name_clean = i['name'].replace(' ', '')
                if i_name_clean in synonym:
                    i_name_clean = synonym[i_name_clean]
                ings_cleaned.append(i_name_clean)
            ings_cleaned = set(ings_cleaned)
            # skip recipe with less than 3 ingredients
            if len(ings_cleaned) < 3:
                continue
            # count ingredient occurrence
            for i in ings_cleaned:
                ing_counter[i] += 1
            all_json[j['name']] = {'category': c, 'ingredients': ings_cleaned}

recipes = []
ingredients = []
links = []

for rec, properties in all_json.items():
    c = properties['category']
    ings = properties['ingredients']
    # only keep ingredients with more than 3 occurrence
    ings = [i for i in ings if ing_counter[i] >= 3]
    if len(ings) < 3:
        continue
    recipes.append({'type': 'recipe',
                    'id': f'r_{rec}',
                    'name': rec,
                    'category': c,
                    'freq': len(ings)})
    for i in ings:
        links.append({'source': f'i_{i}', 'target': f'r_{rec}', 'value': 1})

# add ingredient node
for name, freq in ing_counter.items():
    if freq < 3:
        continue
    i_category = "other"
    if name in category_synonym:
        i_category = category_synonym[name]
    ingredients.append({'type': 'ingredient',
                        'id': f'i_{name}',
                        'name': name,
                        'category': i_category,
                        'freq': freq})

final_recipe_set = {r['id'] for r in recipes}
final_ing_set = {i['id'] for i in ingredients}

links = [li for li in links if li['source'] in final_ing_set and li['target'] in final_recipe_set]

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
