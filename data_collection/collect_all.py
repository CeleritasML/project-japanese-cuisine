import os
import time

from data_collection.scrape_recipe import read_recipe, to_json

output_path = '../data/'

with open('recipe_links.txt', 'r') as f:
    urls = [line.strip('\n') for line in f.readlines()]


for i, url in enumerate(urls):
    if i < 128:
        continue
    name = url.replace('https://www.justonecookbook.com/', '').strip('/')
    print(f'scraping {i}: {name}...')
    filename = f'{name}.json'
    try:
        recipe_json = read_recipe(url)
        to_json(recipe_json, os.path.join(output_path, filename))
    except Exception:
        print(f'fail to parse {i}: {name}')
    time.sleep(0.1)
