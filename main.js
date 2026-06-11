document.addEventListener("DOMContentLoaded", () => {
  loadCSV(
    "data/tax-revenues-vs-income-inequality/tax-revenues-vs-income-inequality.csv",
    "data/gdp-per-capita-worldbank/gdp-per-capita-worldbank.csv"
  ).then((rows) => {
    const year = 2021;
    const currentYearsData = rows
      .filter((d) => d.year >= year)
      .filter((d) => d.gini !== null);
    console.log(currentYearsData);
    drawChoroplethMap(currentYearsData);
  });
});
