document.addEventListener("DOMContentLoaded", () => {
  loadCSV(
    "data/tax-revenues-vs-income-inequality/tax-revenues-vs-income-inequality.csv",
    "data/gdp-per-capita-worldbank/gdp-per-capita-worldbank.csv"
  ).then((rows) => {
    const year = 2023;
    const yearGap = 3;
    const currentYearsData = rows
      .filter((d) => d.year >= year - yearGap && d.year <= year + yearGap)
      .filter((d) => d.gini !== null);
    drawChoroplethMap(currentYearsData);
    drawBubblePlot(rows);
  });
});
