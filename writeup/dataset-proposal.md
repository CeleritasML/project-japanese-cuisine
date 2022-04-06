# ANLY-503 Dataset Proposal

## Team

- Jingsong Gao (jg2109)
- Yu Kang (yk685)
- Chao Li (cl1486)
- Ercong Luo (el890)
- Rui Qiu (rq47)

## Dataset source

Created by Namiko Hirasawa Chen, ***[Just One Cookbook](https://www.justonecookbook.com/yaki-onigiri-grilled-rice-ball/)*** is a blog focused on authentic and modern Japanese recipes. This website is the source of our dataset, and our group has already custom Python scrips that uses `beautifulsoup4` to scrape all these recipes into JSON files.

In each blog post article, a detailed step-by-step recipe is provided for a dish, as well as a list of ingredients, nutritional values per serving, and left-over storing recommendations. Chef Chen's website contains over 800 blog articles, meaning there are 800+ recipes that we can scrape to create our dataset.

All recipes on the website are partitioned into the following categories:

- `appetizer`
- `beverage`
- `breakfast`
- `dessert`
- `entree`
- `lunch`
- `salad`
- `side`
- `soup-stew`.

Our data set, which contains a corpus of recipes will have the following directory hierarchy:

> <root-directory>/<recipe-category>/<recipe-name>.JSON

For example, the recipe for Teriyaki Chicken which is an entree dish will have the path:

> ./entree/teriyaki-chicken.JSON

In each JSON file, all the relevant datafields will be appropriately filled in by our custom web scraper. The most important fields as we anticipate our final visualizations include:

- `name`, the name of the recipe
- `cuisine`, the origin of the recipe. A traditional Japanese dish will have the value 'Japanese', however a Japanese adaptation of an American dish will have the value 'American' or 'American, Japanese'.
- `ingredients`, a list of ingredients needed to make the dish.
- `nutrition`, the list of nutritional values per serving.

An example JSON file would look like the following:

```json
{
    "name": "Asparagus with Miso Dressing (Karashi Sumisoae)",
    "summary": "Asparagus with Miso Dressing (Karashi Sumisoae) is a perfect dish to welcome spring! Blanched and shocked in iced water, asparagus offers a fresh, crisp, and tender texture. It's optional but a touch of Japanese karashi mustard adds a bold surprise to the simple dressing. ",
    "image_url": "https://www.justonecookbook.com/wp-content/uploads/2021/04/Asparagus-with-Miso-Dressing-Karashi-Sumisoae-6543-I-1-500x500.jpg",
    "cuisine": [
        "Japanese"
    ],
    "keywords": [
        "asparagus",
        "miso"
    ],
    "ingredients": [
        {
            "name": "asparagus",
            "raw_text": "asparagus"
        },
        ...
    ],
    "nutrition": [
        {
            "nutrition": "Calories",
            "value": "26",
            "unit": "kcal"
        },
        ...
    ]
}
```

## Motivation

As foodies ourselves, we have always been interested in uncovering the myth of authenticity in Japanese food. Many Japanese-branded restaurants in the Washington D.C. Metropolian Area are actually not Japanese-owned and do not cook authentic Japanese recipes. One of us who grew up in Mainland China but has traveled to Japan multiple times has anecdotally observed that a key ingredient that Japanese restaurants owned by Chinese immigrants always seem to miss a key ingredient: dashi (出汁，だし). Dashi is the soup base made from bonito flakes and kombu. Such a soup base is traditionally considered an offensive flavor in most Chinese households for being too fishy. However, dashi is the basis of flavor in many well-known dishes such as miso soup and shoyu ramen. So an frequently successful way to identify a Chinese-owned Japanese restaurant is when the restaurant does not use dashi.

We wish to confirm anecdotal observations such as the one above using text visualization from our data set. How? One visualization we can deploy to show the central importance of dashi in Japanese cuisine is using a network where Japanese recipes and ingredients are nodes, and a connection is formed between a recipe and an ingredient when the recipe contains the ingredient. The visualization will certainly show that dashi is one of the most connected nodes in the entire network, and therefore one of the most important ingredients that define an authentic Japanese flavor.

All in all, these are the questions we would like to answer with visualizations:

- Which ingredients are the most frequently used in Japanese dishes? (Network of ingredients and recipes)
- What combinations of ingredients are more prevalent? (Network visualization from association rule mining)
- For dishes that are imported to and adapted in Japan, which countries do they most frequently come from? (geospatial interactive visualization)
- Is it a myth that Japanese food is generally low-calorie? (exploratory data analysis on nutrition data)

Our project aims to give our audience a visual introduction of ingredients, flavors and notes that define Japanese cuisine, and potentially induces them to have some "ah-ha" moments.
