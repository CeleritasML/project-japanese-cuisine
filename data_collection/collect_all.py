import os
import time

from data_collection.scrape_links import get_links, to_txt
from data_collection.scrape_recipe import read_recipe, to_json

link_path = 'links/'
output_path = '../data/'

categories_with_pages = {
    'appetizer': 6,
    'beverage': 3,
    'breakfast': 3,
    'dessert': 11,
    'entree': 32,
    'salad': 5,
    'side': 11,
    'soup-stew': 5
}

categories_with_links = {}

for category, page in categories_with_pages.items():
    links = get_links(category, page)
    to_txt(links, os.path.join(link_path, f'{category}.txt'))
    categories_with_links[category] = links

for category, links in categories_with_links.items():
    os.mkdir(os.path.join(output_path, category))
    for i, url in enumerate(links):
        name = url.replace('https://www.justonecookbook.com/', '').strip('/')
        print(f'scraping {i}: {name}...')
        filename = f'{name}.json'
        try:
            recipe_json = read_recipe(url)
            to_json(recipe_json, os.path.join(output_path, category, filename))
        except Exception:
            print(f'\tfail to parse {i}: {name}')
        time.sleep(0.1)
