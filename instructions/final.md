# Final Project Submission

## Submission (Publish Release)

* Tag a release of your project with tag version `v1.0-final` by the **due date**. Your release must contain the final implemanetation. [See instructions for creating releases on Github](https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository).

* Push your code to [GitHub](www.github.com)

* Add a `final.md` file to your repository (see writeup section below.)

## Implementation

Continue to develop your visualization project by using your git repository (don't forget, we'll be considering your commits when grading your project).
Turn your project proposal into an interactive web-based visualization that is ready to be deployed and that can be consumed by your intended audience.
Make sure that your code is well-organized, easy to read, and contains code comments. Use separate files for visualization components, use functions to promote code reuse.

Recall the minimum requirements (from the [proposal](proposal.md):

* **At least 5** different views / visualization components (e.g. 3 bar charts only count as 1 component).
* At least 1 of these views must be an "innovative view" that is either (a) an extension of an existing visualization type, or (b) a novel visualization type.
* Multiple views coordinated with linked highlighting. A click/hover/selection interaction within one view must trigger a change in a different view. At least 2 views need to be linked.
* Include interactive tooltips, in at least one view, that are shown when users hover over marks.

### Reminders

* We don't allow custom backends (Node.js, Python, etc) and database systems, such as Postgres or MySQL
* Your web application should be stand-alone and have an `index.html` file as the entry point
* You can either store static (maybe preprocessed) datasets in your git repo or access live data through an API. Refine the features you started earlier and implement the rest of the features you outlined in your proposal, paying
close attention to usability.
* Your interface should be as self-documenting as possible, with appropriate labels for panes, axes, and widgets, a legend documenting the meaning of visual encodings, and a meaningful title and description for the app. Apply what you have learned in the color foundation lectures and choose appropriate color schemes.

## Write-up

In addition to the final implementation, **you must include a markdown document** called `final.md` in the `writeup/` directory of your repository which describes the following:

**Note: an empty document has been created for you**

1. Visualization

 Describe the visualization interface that you have built. What views are there and what do they allow users to do? For each view, describe your visual encoding choices and include the rationale for your design choices. How can users interact with your project within each view, and how are views linked?
Include screenshots.

2. Reflection

* Describe how your project has developed from your initial proposal, through your first submission, to your final product. How have your visualization goals changed?
* How have your technical goals changed?
* How realistic was your original proposal in terms of what is technically possible in D3?
* Was there anything you wanted to implement that you ultimately couldn't figure out how to do? If so, then what workarounds did you employ, or did you abandon your original idea?
* If you were to make the project again from scratch (or any other interactive visualization), what would you do differently?
  