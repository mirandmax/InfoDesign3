# InfoDesign3: Tax & Inequality - A Global Overview

A data visualization project exploring the relationship between income inequality and tax revenues across the globe since 1990. Created by Diego Grünberger, Max Mirandola, and Elias Puntaier.

## Project Overview

This project visualizes:
- **Income inequality trends** across continents using the Gini coefficient
- **Tax revenue vs. inequality correlation** through interactive bubble plots
- **Historical data patterns** showing how wealth distribution has evolved globally

## Prerequisites

- **Git** (to clone the repository)
- **Node.js** (for running a local development server) 

## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/mirandmax/InfoDesign3.git
cd InfoDesign3
```

### 2. Start a Local Web Server

Since the project loads CSV files locally, you need to run a web server to avoid CORS restrictions. Choose one of these options:

**Using Node.js with http-server**

```bash
# Install http-server globally (if not already installed)
npm install -g http-server

# Start the server
http-server -p 8000
```

### 3. Open in Browser

Once the server is running, open your browser and navigate to:

```
http://localhost:8000
```

You should see the visualization with interactive charts and controls.

## Dependencies

The project uses:
- **D3.js v7.9.0** - Data visualization library (loaded via CDN)

## Usage

### Interacting with Visualizations

- **Choropleth Map**: Hover over countries to see Gini coefficient values
- **Bubble Plot**: Use the year slider to see how tax revenue and inequality relationships change over time
- **Tooltips**: Hover over data points for detailed information

## Data Sources

- **Tax Revenues & Income Inequality Data**: [Our World in Data](https://ourworldindata.org/grapher/tax-revenues-vs-income-inequality)
- **GDP Per Capita Data**: [Our World in Data](https://ourworldindata.org/grapher/gdp-per-capita-worldbank)

## Authors

- Diego Grünberger
- Max Mirandola
- Elias Puntaier