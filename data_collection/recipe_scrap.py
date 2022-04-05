import json

from bs4 import BeautifulSoup
import requests


def fetch_html(url):
    resp = requests.get(url)
    soup = BeautifulSoup(resp.text, 'html.parser')
    return soup


def parse_base_info(html_soup):
    inner_div = html_soup.find('div', class_='wprm-inner')
    base_info = {}
    name_div = inner_div.find('h2', class_='wprm-recipe-name')
    summary_div = inner_div.find('div', class_='wprm-recipe-summary')
    image_div = inner_div.find('div', class_='wprm-recipe-image')
    base_info['name'] = name_div.string
    base_info['summary'] = summary_div.string
    base_info['image_url'] = image_div.find('img')['data-lazy-src']
    return base_info


def parse_ingredient(html_soup):
    ingredients_span = html_soup.find_all('span', class_='wprm-recipe-ingredient-name')
    ingredients = []
    for ing in ingredients_span:
        ing_dict = {
            'name': ing.string.split('(')[0].strip(' '),
            'raw_text': ing.string,
        }
        ingredients.append(ing_dict)
    return ingredients


def parse_nutrition(html_soup):
    nutritions_div = html_soup.find('div', class_='wprm-nutrition-label-container')
    nutritions_span = nutritions_div.find_all('span', class_='wprm-nutrition-label-text-nutrition-label')
    nutritions = []
    for nu in nutritions_span:
        val = nu.find_next_sibling()
        unit = val.find_next_sibling()
        nu_dict = {
            'nutrition': nu.string.replace(': ', ''),
            'value': val.string,
            'unit': unit.string,
        }
        nutritions.append(nu_dict)
    return nutritions


def parse_additional_info(html_soup):
    addition_area = html_soup.find('div', class_='recipe-card-details')
    additonal = {}
    cuisine = addition_area.find('span', class_='wprm-recipe-cuisine')
    keywords = addition_area.find('span', class_='wprm-recipe-keyword')
    additonal['cuisine'] = cuisine.string
    additonal['keywords'] = keywords.string.split(', ')
    return additonal


def read_recipe(recipe_url):
    recipe_html = fetch_html(recipe_url)
    recipe_json = {}
    recipe_json.update(parse_base_info(recipe_html))
    recipe_json.update(parse_additional_info(recipe_html))
    recipe_json['ingredients'] = parse_ingredient(recipe_html)
    recipe_json['nutrition'] = parse_nutrition(recipe_html)
    return recipe_json


def to_json(recipe_json, filename):
    with open(filename, 'w') as f:
        json.dump(recipe_json, f, indent=4)


if __name__ == '__main__':
    test_url = 'https://www.justonecookbook.com/okra-with-ginger-soy-sauce/'
    j = read_recipe(test_url)
    to_json(j, 'okra-with-ginger-soy-sauce(sample).json')
