
document.addEventListener('DOMContentLoaded', () => {  
  loadCSV('resources/tax-revenues-vs-income-inequality.csv').then(rows => {
    const year = 2023;
    
    drawChoropolethMap(rows)
  });

});
