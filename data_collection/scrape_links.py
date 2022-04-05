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

# function to extract html document from given url
def getHTMLdocument(url):
      
    # request for HTML document of given url
    response = requests.get(url)
      
    # response will be provided in JSON format
    return response.text
  
# get list of urls to scrape main entree links
urls = []
for i in range(1,32):
    urls.append("https://www.justonecookbook.com/categories/recipes/entree/page/" + str(i) + '/')

recipe_links = []

for url in urls:
    # assign URL
    url_to_scrape = url
    
    # create document
    html_document = getHTMLdocument(url_to_scrape)
    
    # create soap object
    soup = BeautifulSoup(html_document, 'html.parser')
    
    # find all the anchor tags with "href" 
    # attribute starting with "https://"
    for link in soup.find_all('a', 
                              attrs={'href': re.compile("^https://"),
                                     'rel': "entry-image-link",
                                     'class': "featured-image"}):
        # attach the actual urls
        recipe_links.append(link.get('href'))  
    

with open('recipe_links.txt', 'w') as f:
    for l in recipe_links:
        f.write(l)
        f.write('\r\n')

