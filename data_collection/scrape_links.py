#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
anly503 final project

This file scrapes the hrefs from:
https://www.justonecookbook.com/categories/recipes/entree/page/<1-31>
"""

from bs4 import BeautifulSoup
import requests
import re

url_template = 'https://www.justonecookbook.com/categories/recipes/{category}/page/{page}'


def parse_links(html_soup):
    links = []
    for link_a in html_soup.find_all('a',
                                attrs={'href': re.compile("^https://"),
                                       'rel': "entry-image-link"},
                                class_='featured-image'):
        # attach the actual urls
        links.append(link_a.get('href'))
    return links


def get_links(category, max_page):
    all_links = []
    for i in range(1, max_page + 1):
        url = url_template.format(category=category, page=i)
        resp = requests.get(url)
        soup = BeautifulSoup(resp.text, 'html.parser')
        links = parse_links(soup)
        all_links.extend(links)
    return all_links


def to_txt(links, filename):
    with open(filename, 'w') as f:
        for link in links:
            f.write(link)
            f.write('\n')


if __name__ == '__main__':
    links = get_links('entree', 32)
    to_txt(links, 'links/entree.txt')
