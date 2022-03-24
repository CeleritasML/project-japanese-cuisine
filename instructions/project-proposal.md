# Detailed Project Proposal

## Proposal submission

**You will submit your project proposal as a single PDF, with the following sections in this order:**

1. Basic info
2. Overview
3. Description of the data
4. Usage scenario & tasks
5. Description of visualization & initial sketch
6. Work breakdown and schedule

Your proposal should be no more than 1,500 words of text (for context, this equates to a little over 1.5 pages of single-spaced Times New Roman size 11 text). You will also submit 1-5 sketches of your visual narrative, included in the same PDF (which should be no longer than 3 pages in total)

The first four sections of your proposal will be marked as a whole, and you will be assessed on the quality and clarity of your writing, the feasibility of what you propose, and your initial project description and sketch. The following sections are required

### Section 1: Basic info

- Project title

### Section 2: Overview

- A few sentences that describe what problem your visualization is tackling and how. You don't necessarily need to create a project that is purely focused on exploratory data analysis. You may choose to tell an interactive data-driven story intended to be consumed by the general public. The theme of your visualization can draw from any topic, including current affairs, history, natural disasters, and research findings from the sciences and humanities. State the intended audience. Be brief and clear.

For example:

>  Missed medical appointments cost the healthcare system a lot of money and affects the quality of care. If we could understand what factors lead to missed appointments it may be possible to reduce their frequency. To address this challenge, I propose building a data visualization that allows health care administrators to visually explore a dataset of missed appointments. My app will use show the distribution
> of factors contributing to appointment show/no show and allow users to explore different aspects of this data by filtering and re-ordering on different variables in order to compare factors that contribute to absence.

### Section 3: Detailed description of the data and data pre-processing

In your report, briefly describe the dataset and the variables that you will visualize. All data has to be publicly available. *Provide a link to your data sources.*

Please note, if your dataset has a lot of variables and you plan to visualize them all, then provide a high level descriptor of the variable types, for example say the dataset contains demographic variables instead of describing every single variable. For example: 

> I will be visualizing a dataset of approximately 300,000 missed patient appointments. Each appointment has 15 associated variables that describe the patient who made the appointment (PatientID, Gender, Age), the health status of the patient (Hypertension, Diabetes, Alcohol intake, physical disabilities), information about the appointment itself (appointment ID, appointment date), whether the patient showed up (status), and if a text message was sent to the patient about the appointment (SMSsent). Using this data I will also derive a new variable, which is the predicted probability that a patient will show up for their appointment (ProbShow)

In the above example, specific variables names are indicated in the parenthesis; remember if your dataset has a lot of varibles stick to summaries and don't provide specific variable names. The example also differentiates variables that come with the dataset (i.e. Age) from new variables that you might derive for your visualizations (i.e ProbShow) - you should make a similar distinction in your write-up.

#### Preprocessing

* Do you need to preprocess or clean up the original data? 
* Do need to join multiple datasets? 
* How do you plan to implement the processing pipeline? (R or Python scripts, or other means?)

### Section 4: Usage scenarios & tasks

The purpose of the usage scenario is to get you to think about how someone else might use the website you're going to design, and to think about those needs before you start developing. Usage scenarios are typically written in a narrative style and include the specific context of usage, tasks associated with that
usage context, and a hypothetical walkthrough of how the user would accomplish those tasks with your visualization. If you are using a Kaggle dataset, you may use their "Overview (inspiration)" to create your usage scenario, or you may come up with your own inspiration.

Example usage scenario with tasks (tasks are indicated in brackets, i.e. [task])

> Mary is a policy maker with the Canadian Ministry of Health and she wants to understand what factors lead to missed appointments in order to devise an intervention that improves attendance numbers. She wants to be able to [explore] a dataset in order to [compare] the effect of different variables on absenteeism and [identify] the most relevant variables around which to frame her intervention policy.
> When Mary logs on to the "Missed Appointments app", she will see an overview of all the available variables in her dataset, according to the number of people that did or did not show up to their medical appointment. She can filter out variables for head-to-head comparisons, and/or rank order patients according to their predicted probability of missing an appointment. When she does so, Mary may notice
> that "physical disability" appears to be a strong predictor missing appointments, and in fact patients with a physical disability also have the largest number of missed appointments. She hypothesizes that patients with a physical disability could be having a hard time finding transportation to their appointments, and decides she needs to conduct a follow-on study since transportation information is not captured in her current dataset.

Note that in the above example, "physical disability" being an important variable is fictional - you don't need to conduct an analysis of your data to figure out what is important or not, you just need to imagine what someone could find, and how they may use this information.

### Section 5: Description of your visualization and sketch

Building from your usage scenario, give a high-level description of the visualization interface you will build. What are must-have features without which you would consider your project a failure? Remember to be realistic since you are actually required to implement this interactive visualization, and you will be assessed on
how much, and why, your finalproject deviates from this initial proposal.


Briefly describe the characteristics of your "innovative view component" that is either an extension of an existing visualization type or a novel visualization type. What makes it special?


Your sketch can be hand-drawn or mocked up using Powerpoint, a graphics editor, or wireframe tools, such as Balsamiq. Most likely, you will need more than one image to show your proposed visual design and interaction sequences. Don't use more than five sketches. Please note, this is a very basic illustrative guide that should help you during the implementation of the first prototype. It is by no means the limit of what you should submit as the final project.

### Section 6: Work breakdown and schedule

Include a list of project milestones, breaking down the work into a series of smaller chunks that are meaningful and useful for your specific project. Your milestone list shouldn't just be completely generic (eg "requirements analysis, design, initial coding, iterative refinement, final writeup"). While something analagous to these stages may well make sense for your project, you should also be thinking about how to break down the work into components that are appropriate for your project in specific (eg "create initial static version of view X", "link views X and Y to each other"). As above, think about these questions: What are must-have features? What are optional features that can be implemented after the second milestone, if there is time? Milestones must be associated with two numbers: the estimate of the number of hours each chunk of work will take, and the target date for completion of that chunk. 
The scope of the work should be roughly 50-75 hours for the entire project -- across all three milestones.
