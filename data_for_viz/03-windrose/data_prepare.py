import json

import pandas as pd

df = pd.read_csv("windrose.csv")

results = []

for idx, row in df.iterrows():
    if row['type'] == 'condiments(exclusive)':
        continue
    s = row['appetizer'] + row['beverage'] + row['breakfast'] + row['dessert'] + row['entree'] + row['salad'] \
        + row['side'] + row['soup_stew']
    result = []
    for col in df.columns[1:]:
        result += [{'ingredient': col, 'category': row['type'], 'value': row[col] / s}]
    results += [{'key': row['type'], 'values': result}]

with open('radar.json', 'w') as f:
    json.dump(results, f, indent=4)

#%%
