---
title: "Python Data Visualization: A Practical Guide to Matplotlib, Seaborn, and Pandas"
slug: "python-data-visualization-matplotlib-seaborn-guide"
date: "2026-10-23"
excerpt: "Learn practical data visualization in Python, from your first Matplotlib line chart to Seaborn plots, heatmaps, correlation, and pair plots, with examples you can run in Google Colab."
tags: ["Python", "Data Visualization", "Matplotlib", "Seaborn", "Pandas", "Google Colab", "Learning"]
coverImage: ""
author: "Ugandhar"
published: true
---

# Python Data Visualization: A Practical Guide to Matplotlib, Seaborn, and Pandas

> **Want to watch the walkthrough on YouTube?**  
>
> [Watch the video on YouTube](https://youtu.be/T-u2sO0edDI)

---

Data is easier to understand when we can see it. A table may contain hundreds or thousands of values, but a well-chosen chart can help us notice patterns, compare categories, understand distributions, and spot relationships between variables.

In this guide, we’ll work through the data-visualization topics in my accompanying notebook using **Matplotlib, Seaborn, Pandas, and NumPy**. We’ll begin with simple charts and gradually move to plots that help explore real datasets.

The examples are designed to be run in Google Colab or a Jupyter notebook. You can copy the code, change the values, and observe how the charts respond.

**Notebook:** [Open my original Google Colab notebook](https://colab.research.google.com/drive/1QM1ojOdN_L_ZKB-7WpFX3Ta-iyYVhk_G?usp=sharing)

The notebook is shared as **view-only**. To experiment without changing the original, open it and select **File → Save a copy in Drive**. You can then edit and run your own copy.

![Pie Chart, Area plot, Line Chart, Hexbin plots, Histogram, Heat map, kde charts, Box Plot, Bar Charts, Scatter Chart, and Pair plot.](https://i.imgur.com/K01eniT.png)

Examples of Python data visualizations created with Matplotlib and Seaborn.
## 1. What is data visualization?

Data visualization is the process of representing information visually using charts, graphs, and plots. It helps us answer questions such as:

- How does a value change over time?
- Which category has the highest or lowest value?
- How are values distributed?
- Do two numerical variables appear to be related?
- Are there patterns across several variables?

The chart should fit the question. A line chart is usually useful for showing a trend, a bar chart for comparing categories, a histogram for understanding a distribution, and a scatter plot for examining the relationship between two numerical variables.

A chart can be attractive and still be misleading. Always label the axes, choose a suitable chart type, and avoid drawing conclusions that the data does not support.

## 2. Set up the Python libraries

The notebook uses four libraries:

- **Pandas** helps work with tabular data using DataFrames.
- **NumPy** provides numerical operations and tools for creating arrays.
- **Matplotlib** is a flexible plotting library that gives us detailed control over charts.
- **Seaborn** builds on Matplotlib and provides convenient statistical visualizations with sensible defaults.

In Google Colab, these libraries are commonly available already. Start with these imports:

```python
import pandas as pd
import numpy as np
import seaborn as sns
import matplotlib.pyplot as plt
```

If you are running Python locally and a library is missing, install the required packages in your terminal:

```bash
python -m pip install pandas numpy matplotlib seaborn
```

For most examples, `plt.show()` displays the chart. In notebooks, charts may sometimes appear automatically, but including `plt.show()` makes the intention clear.

## 3. Matplotlib: start with the basics

Matplotlib gives you control over the chart, including the data, labels, title, size, markers, and layout.

### 3.1 Create a basic line chart

A line chart connects points in sequence. It is often used to show changes over an ordered dimension, such as time, temperature readings, or measurements taken during an experiment.

```python
x = [1, 2, 3, 4, 5]
y = [2, 4, 3, 7, 6]

plt.plot(x, y)
plt.show()
```

Here, `x` contains the horizontal-axis values and `y` contains the vertical-axis values. Each pair forms a point, and Matplotlib connects the points with lines.

![A simple Matplotlib line chart connecting five data points.](https://i.imgur.com/J5qLmEc.png)


The notebook also creates example values with NumPy:

```python
x = list(range(1, 6))
y = sorted(list(np.random.randint(1, 10, 5)))

plt.plot(x, y)
plt.show()
```

`np.random.randint(1, 10, 5)` creates five random integers from 1 up to, but not including, 10. Because the values are random, your chart may look different each time you run the cell. Sorting the values makes the example rise or stay level, but this is only demonstration data—not a real trend.

### 3.2 Change the chart size

Use `plt.figure(figsize=(width, height))` to control the figure size. The values are measured in inches.

```python
plt.figure(figsize=(10, 3))
plt.plot(x, y)
plt.show()
```

A wider figure can make long labels or a time-based trend easier to read. The size does not change the underlying data; it changes the space available to display the chart.

![A simple Matplotlib line chart connecting five data points but with fixed size using figsize function.](https://i.imgur.com/MhdP7yJ.png)

### 3.3 Add a title and axis labels

Titles and axis labels explain what the chart represents. Add them before calling `plt.show()`.

```python
plt.figure(figsize=(8, 4))
plt.plot(x, y)

plt.xlabel("Observation")
plt.ylabel("Value")
plt.title("Example Line Chart")

plt.show()
```

Use labels that describe the actual data. For example, if the x-axis represents dates and the y-axis represents temperature, label them accordingly instead of using generic names.

![A Matplotlib line chart with a title and labelled horizontal and vertical axes.](https://i.imgur.com/sECTWCr.png)

### 3.4 Change markers and line appearance

Matplotlib supports format strings for common marker and line styles. In the notebook, `"r*"` means red star markers, `"ro"` means red circle markers, and `"b^"` means blue triangle markers.

```python
plt.plot(x, y, "r*")
plt.xlabel("Observation")
plt.ylabel("Value")
plt.title("Values Shown as Star Markers")
plt.show()
```
![A Matplotlib chart with Red star(*) markers](https://i.imgur.com/nu46QrF.png)

To compare two series, plot both on the same axes:

```python
x = [1, 2, 3, 4, 5]
series_a = [2, 4, 3, 7, 6]
series_b = [1, 3, 5, 4, 8]

plt.plot(x, series_a, "ro", label="Series A")
plt.plot(x, series_b, "b^", label="Series B")

plt.xlabel("Observation")
plt.ylabel("Value")
plt.title("Comparing Two Series")
plt.legend()
plt.show()
```

The `label` values become useful when you call `plt.legend()`. Without a legend, viewers may not know which series the markers represent.

![Two plots on the same chart](https://i.imgur.com/k46FQ4z.png)

### 3.5 Scatter plots

A scatter plot displays points without connecting them by lines. It is useful when you want to inspect how two numerical variables move in relation to each other.

```python
x = np.arange(1, 6)
y = x ** 3

plt.scatter(x, y)
plt.xlabel("x")
plt.ylabel("x cubed")
plt.title("Scatter Plot")
plt.show()
```

`np.arange(1, 6)` creates the values 1 through 5, and `x ** 3` calculates the cube of each value.

Use a scatter plot when the individual observations matter. Use a line chart when connecting points is meaningful—for example, when the x-axis follows time or another natural sequence.

![A simple Matplotlib scatter plot showing five data points.](https://i.imgur.com/1cREdyE.png)

### 3.6 Multiple plots with subplots

Subplots let you place multiple charts inside one figure. This makes it easier to compare related views without opening separate figures.

The basic `plt.subplot(rows, columns, position)` function uses a grid. The position is counted from left to right, then top to bottom, starting at 1.

```python
plt.figure(figsize=(10, 4))

plt.subplot(1, 2, 1)
plt.plot(x, y, "r*")
plt.title("Chart One")

plt.subplot(1, 2, 2)
plt.plot(x, y, "bo")
plt.title("Chart Two")

plt.tight_layout()
plt.show()
```

In this example, `1, 2` means one row and two columns. The first chart occupies position 1 and the second occupies position 2.

![Example of a subplot](https://i.imgur.com/B1gkok6.png)

For two charts stacked vertically, use `plt.subplot(2, 1, 1)` and `plt.subplot(2, 1, 2)`.

### 3.7 Use `plt.subplots()` for more control

`plt.subplots()` creates a figure and a collection of axes. It is often more convenient when you need several charts.

```python
fig, ax = plt.subplots(nrows=2, ncols=2, figsize=(8, 6))

ax[0, 0].plot(x, y, "r*")
ax[0, 0].set_title("Chart One")

ax[0, 1].plot(x, y, "b^")
ax[0, 1].set_title("Chart Two")

ax[1, 0].plot(x, y, "ro")
ax[1, 0].set_title("Chart Three")

ax[1, 1].plot(x, y, "b-")
ax[1, 1].set_title("Chart Four")

plt.tight_layout()
plt.show()
```

`fig` refers to the overall figure, while `ax` contains the individual plotting areas. For a 2-by-2 layout, `ax[0, 0]` is the top-left chart and `ax[1, 1]` is the bottom-right chart.

![Four Matplotlib charts arranged in a two-row, two-column grid.](https://i.imgur.com/FoqPxFn.png)

## 4. Common chart types in Matplotlib

### 4.1 Bar chart

A bar chart compares values across categories.

```python
country = ["India", "USA", "UK"]
players = [100, 105, 65]

plt.bar(country, players)
plt.title("Players by Country")
plt.xlabel("Country")
plt.ylabel("Number of Players")
plt.show()
```

The category names are on the x-axis and the numerical values are represented by bar heights.

![A simple Matplotlib bar graph.](https://i.imgur.com/8zIc2il.png)

For long category names, a horizontal bar chart may be easier to read:

```python
plt.barh(country, players)
plt.title("Players by Country")
plt.xlabel("Number of Players")
plt.ylabel("Country")
plt.show()
```

![A simple Matplotlib bar graph.](https://i.imgur.com/1RFmGgx.png)

Choose vertical or horizontal bars based on which version makes the labels and comparisons clearer.

### 4.2 Pie chart

A pie chart shows how categories contribute to a whole. It is most readable when there are only a few categories and their values add up to a meaningful total.

```python
plt.pie(
    players,
    labels=country,
    autopct="%.1f%%"
)
plt.title("Share of Players by Country")
plt.show()
```

- `labels` names each slice.
- `autopct="%.1f%%"` prints each slice's percentage to one decimal place.
- `colors` can specify slice colours.
- `explode` can offset a slice from the centre.

For example:

```python
plt.pie(
    players,
    labels=country,
    autopct="%.1f%%",
    explode=[0.1, 0, 0]
)
plt.title("Share of Players by Country")
plt.show()
```

![A simple Pie chart using Matplotlib](https://i.imgur.com/MGjqGaG.png)

The first slice is separated slightly because its `explode` value is `0.1`. The `explode` list must have one value for each slice.

Avoid pie charts with too many categories or values that are almost identical. A bar chart is usually easier for precise comparisons.

### 4.3 Other useful Matplotlib charts

The notebook briefly points toward histograms and box plots. We will explore those in Seaborn below, where the examples use a dataset. Matplotlib also supports both chart types directly.

## 5. Seaborn: statistical visualizations with less code

Seaborn is built on top of Matplotlib. It offers high-level functions for categorical and numerical data, often with fewer lines of code.

### 5.1 Load a built-in dataset

The notebook uses Seaborn's `tips` dataset:

```python
df = sns.load_dataset("tips")
df.head()
```

This dataset contains restaurant bill and tip information, including columns such as `total_bill`, `tip`, `sex`, `smoker`, `day`, `time`, and `size`.

`df.head()` displays the first five rows by default. It is a useful first step because it helps you check the available columns and see what the data looks like before plotting it.

Seaborn also provides other built-in example datasets. You can inspect available dataset names with:

```python
sns.get_dataset_names()
```

Built-in datasets are useful for practice. For your own project, load your own data into a Pandas DataFrame and replace the example column names with the columns in your file.

![The first five rows of Seaborn's tips dataset displayed as a Pandas DataFrame.](https://i.imgur.com/09noOsz.png)

### 5.2 Set the plot style and colour palette

Seaborn provides styles that affect the background and grid:

```python
sns.set_style("white")
```

or:

```python
sns.set_style("whitegrid")
```

A colour palette controls the colours used for multiple categories:

```python
sns.color_palette()
```

Use styles to improve readability, not to decorate a chart unnecessarily. Make sure text, lines, and data points remain easy to distinguish.

## 6. Categorical data: count plots and category comparisons

Categorical variables describe groups or labels, such as gender, day, meal time, or smoker status. A count plot shows how many rows belong to each category.

### 6.1 Count the observations in a category

```python
sns.countplot(x="sex", data=df)
plt.title("Number of Records by Sex")
plt.xlabel("Sex")
plt.ylabel("Count")
plt.show()
```

`x="sex"` places the category along the horizontal axis. `data=df` tells Seaborn which DataFrame contains the column. Seaborn counts the observations in each category automatically.

![](https://i.imgur.com/pDEz5Et.png)

You can place the categories on the y-axis instead:

```python
sns.countplot(y="sex", data=df)
plt.title("Number of Records by Sex")
plt.show()
```

Horizontal charts can be useful when category names are long. If labels overlap, adjust their rotation or change the figure size.

### 6.2 Compare two categorical variables with `hue`

The `hue` parameter adds a second categorical dimension by separating each category using colour.

```python
sns.countplot(x="sex", hue="smoker", data=df)
plt.title("Records by Sex and Smoker Status")
plt.show()
```

![](https://i.imgur.com/jXoFS1J.png)

This lets you compare the smoker categories within each sex category. It is still a count of records; it does not automatically show percentages.

### 6.3 Use Pandas `crosstab()`

Pandas can create a frequency table from two categorical columns:

```python
pd.crosstab(df["sex"], df["smoker"])
```

You can plot the result as a bar chart:

```python
pd.crosstab(df["sex"], df["smoker"]).plot(kind="bar")
plt.title("Sex by Smoker Status")
plt.show()
```

Or create a stacked bar chart:

```python
pd.crosstab(df["sex"], df["smoker"]).plot(
    kind="bar",
    stacked=True
)
plt.title("Sex by Smoker Status")
plt.show()
```

A grouped bar chart makes it easier to compare separate categories side by side. A stacked bar chart shows the combined total as well as the contribution of each subgroup. Consider using normalized counts if the groups have very different sizes and you want to compare proportions.

### 6.4 Compare categories across another dimension

`catplot()` can split a categorical chart into separate panels using `col`.

```python
sns.catplot(
    x="sex",
    hue="smoker",
    col="time",
    data=df,
    kind="count"
)
plt.show()
```

Here, the chart is separated into panels for the `time` categories, while the bars compare `sex` and `smoker`. This is an example of exploring more than two dimensions in one view.

![A Seaborn count plot comparing records across sex and smoker categories.](https://i.imgur.com/zgjyCFs.png)

## 7. Numerical data: distributions and outliers

Numerical variables contain measured values, such as a bill amount, a tip, or a passenger count. Before comparing numerical values, it helps to understand their distribution.

### 7.1 Histogram

A histogram groups numerical values into intervals called bins and displays how many observations fall in each interval.

```python
sns.histplot(data=df, x="total_bill")
plt.title("Distribution of Total Bills")
plt.xlabel("Total Bill")
plt.ylabel("Number of Records")
plt.show()
```

Use a histogram to see where values are concentrated, whether the distribution is skewed, and whether there are possible gaps or multiple peaks. The shape can change when you change the number or width of bins.

### 7.2 Box plot

A box plot summarises a numerical distribution using quartiles and marks potential outliers.

```python
sns.boxplot(data=df, x="total_bill")
plt.title("Total Bill Distribution")
plt.show()
```

A box plot is useful when you need a compact summary of spread. In the standard interpretation, the box spans the first to third quartiles, the line inside marks the median, and whiskers extend according to the plotting rule. Points beyond the whiskers may be shown as potential outliers; they are not automatically errors.

### 7.3 Compare a numerical variable across categories

You can compare bill values across lunch and dinner records:

```python
sns.boxplot(
    data=df,
    x="time",
    y="total_bill"
)
plt.title("Total Bill by Meal Time")
plt.xlabel("Meal Time")
plt.ylabel("Total Bill")
plt.show()
```

This shows the distribution of `total_bill` for each `time` category. It is more informative than comparing only the averages because you can also see the spread and possible outliers.

### 7.4 Violin plot

A violin plot combines a distribution shape with a comparison across categories:

```python
sns.violinplot(
    data=df,
    x="time",
    y="total_bill"
)
plt.title("Total Bill Distribution by Meal Time")
plt.show()
```

The width of the violin represents the estimated density of observations at different values. Wider sections indicate where observations are more concentrated. A violin plot can reveal distribution shapes that a box plot hides, but it may be less familiar to some readers.

### 7.5 Swarm plot

A swarm plot shows individual observations and positions them to reduce overlap:

```python
sns.swarmplot(
    data=df,
    x="time",
    y="total_bill"
)
plt.title("Individual Total Bills by Meal Time")
plt.show()
```

Swarm plots are useful for small or moderate datasets because you can see the individual points. With large datasets, points may overlap or the plot may become slow and crowded.

You can combine a box plot and swarm plot to show both the summary and the individual observations:

```python
sns.boxplot(data=df, x="time", y="total_bill")
sns.swarmplot(data=df, x="time", y="total_bill")
plt.title("Total Bills by Meal Time")
plt.show()
```

This combination can help, but the points may obscure the box if the dataset is large. Choose the level of detail that suits your data.

![Seaborn charts showing the distribution of restaurant bills using histograms, box plots, violin plots, and individual points across meal times.](https://i.imgur.com/HJqtG3q.png)

## 8. Explore relationships between numerical variables

When two columns contain numerical values, a scatter plot can help you see whether they move together, whether the relationship looks linear, and whether there are unusual observations.

### 8.1 Scatter plot with `sns.scatterplot()`

```python
sns.scatterplot(
    data=df,
    x="total_bill",
    y="tip"
)
plt.title("Total Bill vs Tip")
plt.xlabel("Total Bill")
plt.ylabel("Tip")
plt.show()
```

![](https://i.imgur.com/rKKpmcH.png)

Each dot represents one record. A general upward pattern would suggest that larger bills tend to be associated with larger tips in this dataset. This is an association, not proof that one variable causes the other.

### 8.2 Add a category with `hue`

```python
sns.scatterplot(
    data=df,
    x="total_bill",
    y="tip",
    hue="sex"
)
plt.title("Total Bill vs Tip by Sex")
plt.show()
```

![](https://i.imgur.com/JfnVCFE.png)

The colour separates points by category. This can help reveal whether the overall pattern looks different between groups, but always check the number of observations and the amount of overlap before making conclusions.

You can also map another variable to marker size:

```python
sns.scatterplot(
    data=df,
    x="total_bill",
    y="tip",
    hue="sex",
    size="time"
)
plt.show()
```

Use extra visual encodings only when they add useful information. Too many colours, sizes, and shapes can make a chart hard to interpret.

### 8.3 Add a fitted trend line with `lmplot()`

`lmplot()` can display a scatter plot with a fitted regression line:

```python
sns.lmplot(
    data=df,
    x="total_bill",
    y="tip"
)
plt.show()
```

To separate the fit by category:

```python
sns.lmplot(
    data=df,
    x="total_bill",
    y="tip",
    hue="sex"
)
plt.show()
```

![](https://i.imgur.com/PDRnhvi.png)

If you want the scatter points without the fitted line, use `fit_reg=False`:

```python
sns.lmplot(
    data=df,
    x="total_bill",
    y="tip",
    hue="sex",
    fit_reg=False
)
plt.show()
```

A fitted line summarises a particular model of the relationship. It should not be treated as proof of causation or assumed to describe every part of the data equally well.

### 8.4 Line plots

Seaborn's `lineplot()` can show how a numerical value changes along an ordered or continuous axis.

```python
sns.lineplot(
    data=df,
    x="total_bill",
    y="tip"
)
plt.show()
```

For many real-world tasks, the x-axis might be time, distance, or a sequence of measurements. Be careful when using a line plot with unordered observations: connecting unrelated records can suggest a trend that does not exist.

The notebook also uses the `flights` dataset:

```python
flights = sns.load_dataset("flights")
flights.head()
```

Then plots passenger counts by year:

```python
plt.figure(figsize=(10, 5))
sns.lineplot(
    data=flights,
    x="year",
    y="passengers"
)
plt.title("Passenger Counts by Year")
plt.show()
```

![](https://i.imgur.com/lmaii58.png)

To distinguish the months:

```python
plt.figure(figsize=(10, 5))
sns.lineplot(
    data=flights,
    x="year",
    y="passengers",
    hue="month"
)
plt.title("Passenger Counts by Year and Month")
plt.show()
```

![A Seaborn line chart showing passenger counts across years in the flights example dataset.](https://i.imgur.com/wstda3k.png)

The second plot uses colour for month. With many categories, a chart can become busy, so consider whether all categories need to be shown together.


## 9. Joint plots: see two distributions together

A joint plot combines a view of the relationship between two numerical variables with views of their individual distributions.

### 9.1 Scatter joint plot

```python
sns.jointplot(
    data=df,
    x="total_bill",
    y="tip",
    kind="scatter"
)
plt.show()
```

![](https://i.imgur.com/9E3XV7l.png)

The centre shows the relationship between `total_bill` and `tip`. The margins show how each variable is distributed on its own.

### 9.2 Density view

```python
sns.jointplot(
    data=df,
    x="total_bill",
    y="tip",
    kind="kde"
)
plt.show()
```

![](https://i.imgur.com/MXqV7Kr.png)

A KDE (kernel density estimate) estimates where values are concentrated. It can be useful when many points overlap, but it is an estimate rather than a direct count of observations.

### 9.3 Histogram joint plot

```python
sns.jointplot(
    data=df,
    x="total_bill",
    y="tip",
    kind="hist"
)
plt.show()
```

![](https://i.imgur.com/JilT8J3.png)

The central area uses bins to show where pairs of values occur. The best choice—scatter, density, or histogram—depends on the number of observations and the question you are trying to answer.

## 10. Heatmaps: display values using colour

A heatmap uses colour to represent values in a grid. It is often used to compare values across two categories or to display a correlation matrix.

### 10.1 Prepare the flights data for a heatmap

The `flights` dataset contains passenger counts for different months and years. To create a grid, use `pivot()`:

```python
flights = sns.load_dataset("flights")

flights_pivot = flights.pivot(
    index="month",
    columns="year",
    values="passengers"
)
```

This reshapes the data so that months become rows, years become columns, and passenger counts fill the cells. A pivot requires the chosen index-and-column combinations to identify unique values.

### 10.2 Create and customise the heatmap

```python
sns.heatmap(flights_pivot)
plt.title("Passenger Counts by Month and Year")
plt.show()
```

![](https://i.imgur.com/n6ycN2S.png)

You can change the colour map and show the values inside the cells:

```python
sns.heatmap(
    flights_pivot,
    cmap="OrRd",
    annot=True,
    fmt="d",
    linewidths=0.5
)
plt.title("Passenger Counts by Month and Year")
plt.show()
```

- `cmap` selects the colour map.
- `annot=True` writes the values inside the cells.
- `fmt="d"` formats the annotations as integers.
- `linewidths` adds separation between cells.

![A heatmap of passenger counts by month and year, with the values printed inside the cells.](https://i.imgur.com/ZSSqZZe.png)

The notebook also tries `"coolwarm"` as another colour map. Choose a palette that makes high and low values easy to distinguish. If the grid is large, annotations may clutter the chart, so leave them off when necessary.


## 11. Correlation: examine numerical relationships

Correlation measures how two numerical variables vary together. A common correlation coefficient ranges from -1 to +1:

- A value near **+1** indicates a strong positive linear relationship.
- A value near **-1** indicates a strong negative linear relationship.
- A value near **0** indicates little or no linear relationship, although a non-linear relationship may still exist.

Correlation does not establish causation. It can also be affected by outliers, restricted ranges, and the structure of the data.

### 11.1 Select numerical columns

The notebook selects numerical columns from the tips dataset:

```python
numeric_df = df.select_dtypes(include="number")
```

Then it calculates the correlation matrix:

```python
correlation_matrix = numeric_df.corr()
correlation_matrix
```

By default, Pandas uses Pearson correlation for numeric columns. The result shows the pairwise correlation between the selected variables.

### 11.2 Plot the correlation matrix

```python
sns.heatmap(
    correlation_matrix,
    annot=True,
    cmap="coolwarm"
)
plt.title("Correlation Between Numerical Variables")
plt.show()
```

The heatmap helps you quickly scan for positive and negative relationships. Read the actual values as well as the colours; a colour difference alone is not a statistical conclusion.

![A labelled correlation heatmap showing relationships among numerical columns in the tips dataset.](https://i.imgur.com/8s7Hcse.png)

## 12. Pair plots: explore several relationships at once

A pair plot creates a grid of plots for combinations of selected variables. It is useful early in exploratory data analysis when you want to inspect several relationships without building each chart manually.

```python
sns.pairplot(
    df[["total_bill", "tip", "size", "sex"]],
    hue="sex",
    diag_kind="hist"
)
plt.show()
```

In this example:

- `total_bill`, `tip`, and `size` are numerical variables.
- `sex` is used to colour observations by category.
- `diag_kind="hist"` displays histograms along the diagonal.
- The other panels show pairwise relationships between numerical variables.

Pair plots can generate many panels, so select a small number of relevant columns. Including too many variables can make the result slow to render and difficult to read.

### Save the pair plot

The notebook also demonstrates saving the generated chart:

```python
plot = sns.pairplot(
    df[["total_bill", "tip", "size", "sex"]],
    hue="sex",
    diag_kind="hist"
)

plot.savefig("pairplot.png", dpi=150, bbox_inches="tight")
```

In Google Colab, the file is saved in the current session's working directory. You can use the Files panel to locate it and download it. A Colab session is temporary, so download important outputs or save them to Drive if you need them later.

![A Seaborn pair plot showing pairwise relationships among total bill, tip, and party size, with observations grouped by sex.](https://i.imgur.com/fuiryzv.png)

## 13. How to choose the right chart

Use this quick guide when deciding which chart to create.

| Your question | A useful starting point |
|---|---|
| How does a value change across time or order? | Line chart |
| How do categories compare? | Bar chart |
| How many observations belong to each category? | Count plot |
| How are numerical values distributed? | Histogram |
| What are the median, spread, and possible outliers? | Box plot |
| How does a distribution vary across categories? | Box plot or violin plot |
| How are two numerical variables related? | Scatter plot |
| How are values arranged across two dimensions? | Heatmap |
| How are numerical columns correlated? | Correlation heatmap |
| How do several numerical variables relate to one another? | Pair plot |
| How do two variables and their individual distributions look together? | Joint plot |

These are starting points rather than strict rules. The same dataset can support several useful charts, depending on the question.

## 14. A practical workflow for your own dataset

The notebook uses built-in datasets so you can focus on plotting. When working with your own data, follow a simple process.

### Step 1: Load and inspect the data

For a CSV file:

```python
df = pd.read_csv("your_file.csv")

display(df.head())
print(df.shape)
print(df.dtypes)
```

`head()` shows sample rows, `shape` reports the number of rows and columns, and `dtypes` shows the data type of each column.

### Step 2: Check the data before plotting

```python
print(df.isna().sum())
print(df.describe(include="all"))
```

Look for missing values, unexpected data types, unusual ranges, and inconsistent category names. Do not automatically remove unusual values; first decide whether they are errors or valid observations.

### Step 3: Write down the question

Instead of asking, “Which chart should I make?”, start with a question:

- Which product has the highest sales?
- Did monthly traffic increase?
- Is there a relationship between study time and marks?
- Do values differ between groups?

The question helps you select the columns and chart type.

### Step 4: Create a chart and label it

```python
sns.scatterplot(data=df, x="column_x", y="column_y")
plt.title("Column X vs Column Y")
plt.xlabel("Column X")
plt.ylabel("Column Y")
plt.tight_layout()
plt.show()
```

Replace the sample column names with actual columns in your dataset.

### Step 5: Check the conclusion

Ask whether the chart answers the original question. Check the axis scales, sample size, missing data, and whether the visualization could hide an important pattern. A chart supports analysis; it does not replace it.

## 15. Common mistakes to avoid

1. **Choosing a chart before defining the question.** A pie chart is not automatically the best way to compare categories, and a line chart is not appropriate for every pair of columns.
2. **Leaving axes or units unclear.** A title and meaningful labels help readers understand what is being shown.
3. **Treating correlation as causation.** Two variables can be related without one causing the other.
4. **Using too many colours.** Use colour to communicate categories or values, not simply to decorate the chart.
5. **Ignoring missing or incorrect data.** Check the dataset before interpreting a graph.
6. **Overloading a chart.** Too many categories or variables can hide the pattern you are trying to find.
7. **Assuming random examples will look the same every time.** The notebook uses randomly generated numbers in some Matplotlib examples, so those outputs can change between runs.
8. **Forgetting to show or save the output.** Use `plt.show()` to display a Matplotlib chart, and save figures when you need to reuse them outside the notebook.

## 16. Try it yourself

Open the notebook, save a copy to your Google Drive, and make these changes:

- Change the line chart values and observe how the shape changes.
- Change the figure size and add labels to every chart.
- Try both vertical and horizontal bar charts.
- Change the `hue` column in the Seaborn count and scatter plots.
- Compare the `total_bill` distributions for lunch and dinner.
- Change the heatmap colour map and toggle annotations.
- Create a correlation heatmap using a different numerical dataset.
- Add or remove a column from the pair plot and see how the layout changes.
- Save one chart as a PNG and use it in a report or presentation.

The goal is not just to run each cell. Try to explain what each chart tells you, what it does not tell you, and why that chart is suitable for the question.

## 17. Notebook and video

**Original notebook:** [Open the Google Colab notebook](https://colab.research.google.com/drive/1QM1ojOdN_L_ZKB-7WpFX3Ta-iyYVhk_G?usp=sharing)

The link is view-only. To edit the code, choose **File → Save a copy in Drive** and work in your own copy.

**Video walkthrough:** [Watch on YouTube](https://youtu.be/T-u2sO0edDI)



---

Data visualization is a skill that improves with practice. Start with small datasets, ask clear questions, and build charts that make the answer easier to see. Once the basics become familiar, you can apply the same ideas to project data, business reports, research, and exploratory data analysis.

*If you use this notebook, make a copy first and experiment freely. That is the best way to learn what each plotting function does.*
