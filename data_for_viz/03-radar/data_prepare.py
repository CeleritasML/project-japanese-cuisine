import json

import pandas as pd

df = pd.read_csv("windrose.csv")

temp_res = {k: [] for k in df.columns[1:]}

for idx, row in df.iterrows():
    if row['type'] == 'condiments(exclusive)':
        continue
    s = row['appetizer'] + row['beverage'] + row['breakfast'] + row['dessert'] + row['entree'] + row['salad'] \
        + row['side'] + row['soup_stew']
    for col in df.columns[1:]:
        temp_res[col] += [{'ingredient': row['type'], 'category': col, 'value': row[col] / s}]

results = []
for k, v in temp_res.items():
    results += [{'key': k, 'values': v}]

with open('radar.json', 'w') as f:
    json.dump({'radar': results}, f, indent=4)

# %%
