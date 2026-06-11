document.addEventListener("DOMContentLoaded", () => {
  loadCSV("data/tax-revenues-vs-income-inequality/tax-revenues-vs-income-inequality.csv").then((rows) => {
    console.log(rows);
    const year = 2023;
    const mockData = [{ Entity: "Italy", gini: 0.33 }, { Entity: "Germany", gini: 0.29 }, { Entity: "United States", gini: 0.41 }];
    drawChoropolethMap(mockData);
  });
});
