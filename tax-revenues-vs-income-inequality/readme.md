# Tax revenue as share of GDP vs. income inequality - Data package

This data package contains the data that powers the chart ["Tax revenue as share of GDP vs. income inequality"](https://ourworldindata.org/grapher/tax-revenues-vs-income-inequality?v=1&csvType=full&useColumnShortNames=false) on the Our World in Data website.

## CSV Structure

The high level structure of the CSV file is that each row is an observation for an entity (usually a country or region) and a timepoint (usually a year).

The first two columns in the CSV file are "Entity" and "Code". "Entity" is the name of the entity (e.g. "United States"). "Code" is the OWID internal entity code that we use if the entity is a country or region. For most countries, this is the same as the [iso alpha-3](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3) code of the entity (e.g. "USA") - for non-standard countries like historical countries these are custom codes.

The third column is either "Year" or "Day". If the data is annual, this is "Year" and contains only the year as an integer. If the column is "Day", the column contains a date string in the form "YYYY-MM-DD".

The remaining columns are the data columns, each of which is a time series. If the CSV data is downloaded using the "full data" option, then each column corresponds to one time series below. If the CSV data is downloaded using the "only selected data visible in the chart" option then the data columns are transformed depending on the chart type and thus the association with the time series might not be as straightforward.


## Metadata.json structure

The .metadata.json file contains metadata about the data package. The "charts" key contains information to recreate the chart, like the title, subtitle etc.. The "columns" key contains information about each of the columns in the csv, like the unit, timespan covered, citation for the data etc..

## About the data

Our World in Data is almost never the original producer of the data - almost all of the data we use has been compiled by others. If you want to re-use data, it is your responsibility to ensure that you adhere to the sources' license and to credit them correctly. Please note that a single time series may have more than one source - e.g. when we stich together data from different time periods by different producers or when we calculate per capita metrics using population data from a second source.

### How we process data at Our World In Data
All data and visualizations on Our World in Data rely on data sourced from one or several original data providers. Preparing this original data involves several processing steps. Depending on the data, this can include standardizing country names and world region definitions, converting units, calculating derived indicators such as per capita measures, as well as adding or adapting metadata such as the name or the description given to an indicator.
[Read about our data pipeline](https://docs.owid.io/projects/etl/)

## Detailed information about each time series


## Tax revenues (% of GDP)
Last updated: March 24, 2026  
Next update: March 2027  
Date range: 1980–2023  
Unit: % of GDP  


### How to cite this data

#### In-line citation
If you have limited space (e.g. in data visualizations), you can use this abbreviated in-line citation:  
UNU-WIDER Government Revenue Dataset (2025) – with major processing by Our World in Data

#### Full citation
UNU-WIDER Government Revenue Dataset (2025) – with major processing by Our World in Data. “Tax revenues (% of GDP) – UNU-WIDER” [dataset]. UNU-WIDER, “Government Revenue Dataset (GRD) 2025” [original data].
Source: UNU-WIDER Government Revenue Dataset (2025) – with major processing by Our World In Data

### What you should know about this data
* Taxes are mandatory payments to the government that are not made in exchange for a specific good or service.
* Social contributions are payments –compulsory or voluntary– made by workers and employers into social insurance systems, such as pensions, unemployment insurance, or health insurance.
* Resource taxes (mostly related to oil and mining) are not systematically defined or captured in the data.

### How is this data described by its producer - UNU-WIDER Government Revenue Dataset (2025)?
The variable Taxes captures tax collected regardless of sources (i.e., unless otherwise defined, this includes resource-based taxes). These follow the definition of taxes found in both the IMF’ Government Finance Statistics Manual (GFSM) and OECD Revenue Statistics Interpretive Guide as ‘compulsory, unrequited …’ payments to the government (IMF 2014; OECD 2020).

The Taxes variables presents aggregate indicators that capture all tax revenue as defined above. Resource taxes typically present taxes levied on natural resource extraction, although differ across territories. Resource Taxes are not (systematically) defined or captured in the OECD Revenue Statistics, and not captured at all in the IMF’s GFS, thus do not have a separate code for either publication.

Social contributions include both compulsory and voluntary social insurance contributions from employers, employees, and the self-employed.

### Source

#### UNU-WIDER – Government Revenue Dataset (GRD)
Retrieved on: 2026-03-24  
Retrieved from: https://www.wider.unu.edu/project/grd-government-revenue-dataset  

#### Notes on our processing step for this indicator
The source provides their data with caution notes, classifying them as follows:

  1. Accuracy, quality or comparability of data questionable.
  2. Un-excluded resource revenues/taxes are significant but cannot be isolated from total revenue/taxes.
  3. Un-excluded resource revenue/taxes are marginal but non-negligible and cannot be isolated from total revenue/taxes.
  4. Inconsistencies with social contributions.

We have excluded from our dataset the observations flagged with caution note 1.



## Gini coefficient
The [Gini coefficient](#dod:gini) measures inequality on a scale from 0 to 1. Higher values indicate higher inequality.
Last updated: January 22, 2026  
Next update: July 2026  
Date range: 1963–2024  


### How to cite this data

#### In-line citation
If you have limited space (e.g. in data visualizations), you can use this abbreviated in-line citation:  
World Bank Poverty and Inequality Platform (2025) – with major processing by Our World in Data

#### Full citation
World Bank Poverty and Inequality Platform (2025) – with major processing by Our World in Data. “Gini coefficient – World Bank” [dataset]. World Bank Poverty and Inequality Platform, “World Bank Poverty and Inequality Platform (PIP) 20250930_2021, 20250930_2017” [original data].
Source: World Bank Poverty and Inequality Platform (2025) – with major processing by Our World In Data

### What you should know about this data
* Depending on the country and year, the data refers either to income (after taxes and benefits) or to consumption, [per capita](#dod:per-capita). For most countries, we have only one option available. But when there is a mix of consumption and income data points, we process the data to keep one observation per country and year.
* Regional and global estimates are extrapolated up until the year of the data release using GDP growth estimates and forecasts. For more details about the methodology, please refer to the [World Bank PIP documentation](https://datanalytics.worldbank.org/PIP-Methodology/lineupestimates.html#nowcasts).
* Many people, today and in the past, have no monetary income. This data accounts for this by including the estimated value of non-market income, such as food grown by subsistence farmers for their own use.

### How is this data described by its producer - World Bank Poverty and Inequality Platform (2025)?
The Gini index measures the extent to which the distribution of income (or, in some cases, consumption expenditure) among individuals or households within an economy deviates from a perfectly equal distribution. A Lorenz curve plots the cumulative percentages of total income received against the cumulative number of recipients, starting with the poorest individual or household. The Gini index measures the area between the Lorenz curve and a hypothetical line of absolute equality, expressed as a percentage of the maximum area under the line. Thus, a Gini index of 0 represents perfect equality, while an index of 100 implies perfect inequality.

### Source

#### World Bank Poverty and Inequality Platform – World Bank Poverty and Inequality Platform (PIP)
Retrieved on: 2025-10-09  
Retrieved from: https://pip.worldbank.org  

#### Notes on our processing step for this indicator
For most countries in the dataset, estimates relate to disposable income or consumption, for all available years. Several countries, however, have a mix of income and consumption data points, with both data types sometimes available for particular years.

In most of our charts, we present the data with some data points dropped to present a single series for each country. This allows us to make readable visualizations that combine multiple countries. In choosing which data points to keep, we strike a balance between maintaining comparability over time and showing as long a time series as possible. As such, the exact approach varies across countries.


## Population
Population by country, available from 10,000 BCE to 2023, based on data and estimates from different sources.
Last updated: July 15, 2024  
Next update: July 2026  
Date range: 10000 BCE – 2023 CE  
Unit: people  


### How to cite this data

#### In-line citation
If you have limited space (e.g. in data visualizations), you can use this abbreviated in-line citation:  
HYDE (2023); Gapminder (2022); UN WPP (2024) – with major processing by Our World in Data

#### Full citation
HYDE (2023); Gapminder (2022); UN WPP (2024) – with major processing by Our World in Data. “Population – HYDE, Gapminder, UN – Long-run data” [dataset]. PBL Netherlands Environmental Assessment Agency, “History Database of the Global Environment 3.3”; Gapminder, “Population v7”; United Nations, “World Population Prospects”; United Nations, “World Population Prospects - Interim Update”; Gapminder, “Systema Globalis” [original data].
Source: HYDE (2023); Gapminder (2022); UN WPP (2024) – with major processing by Our World In Data

### What you should know about this data
* Population is the most commonly used metric throughout Our World in Data. It is used directly to understand population growth over time, and indirectly to calculate per-capita indicators, making it easier to compare countries of different sizes.
* We construct this indicator by combining multiple sources covering different periods.
  - HYDE v3.3 (2023): historical estimates from 10,000 BCE to 1799.
  - Gapminder v7 (2022): for 1800-1949.
  - UN World Population Prospects (2024): for 1950 onwards, including 2100 projections.
  - Gapminder Systema Globalis (2023): additional source for former countries (Yugoslavia, USSR, etc.)
* Breaks in the data may occur at the boundaries between sources due to their methodological differences.
* You can read more about the sources and methodology in our [dedicated article](https://ourworldindata.org/population-sources). We also provide a table of sources showing the source we use for each country-year.
* We calculate geographical aggregates (continents, income groups, etc.) by summing individual country populations. For years before 1800, we rely directly on HYDE's values for continents to ensure historical consistency.

### Sources

#### PBL Netherlands Environmental Assessment Agency – History Database of the Global Environment
Retrieved on: 2024-01-02  
Retrieved from: https://doi.org/10.24416/UU01-AEZZIT  

#### Gapminder – Population
Retrieved on: 2023-03-31  
Retrieved from: http://gapm.io/dpop  

#### United Nations – World Population Prospects
Retrieved on: 2024-07-11  
Retrieved from: https://population.un.org/wpp/downloads/  

#### United Nations – World Population Prospects - Interim Update
Retrieved on: 2026-03-31  
Retrieved from: https://population.un.org/wpp/downloads/  

#### Gapminder – Systema Globalis
Retrieved on: 2023-03-31  
Retrieved from: https://github.com/open-numbers/ddf--gapminder--systema_globalis  

#### Notes on our processing step for this indicator
### Combination of different sources
We construct our long-run population data by combining multiple sources:

- 10,000 BCE–1799: historical estimates by HYDE (v3.3).

- 1800–1949: historical estimates by Gapminder (v7).

- 1950–2023: population records from the United Nations World Population Prospects (2024 revision).

**Geographical aggregates**

- For most years, we calculate aggregates by summing the population of member countries.
- We do this based on [our definition of continents](https://ourworldindata.org/world-region-map-definitions#our-world-in-data) and the [World Bank’s income groups](https://ourworldindata.org/grapher/world-bank-income-groups).
- The only exception is before 1800, where we use HYDE's estimates for continents (but not income groups).

For most of the years, we've estimated regional aggregates by summing the population of countries in each region. We've relied on [our continents](https://ourworldindata.org/world-region-map-definitions#our-world-in-data) and [World Bank income group definitions](https://ourworldindata.org/grapher/world-bank-income-groups). The only exception is before 1800, where we've used HYDE's estimates on continents (but not income groups).

**World**
- Before 1800: we use data from HYDE.
- 1800-1950: we estimate the global population by summing all available countries in the dataset.
- After 1950, we rely on estimates from the United Nations World Population Prospects.


## World region according to OWID
Regions defined by Our World in Data, which are used in OWID charts and maps.
Last updated: January 1, 2023  
Date range: 2023–2023  


### How to cite this data

#### In-line citation
If you have limited space (e.g. in data visualizations), you can use this abbreviated in-line citation:  
Our World in Data – processed by Our World in Data

#### Full citation
Our World in Data – processed by Our World in Data. “World region according to OWID” [dataset]. Our World in Data, “Regions” [original data].
Source: Our World in Data

### Source

#### Our World in Data – Regions


    