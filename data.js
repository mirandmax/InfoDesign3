async function loadCSV(pathForTaxGini, pathForGDPPerCapita) {
  const rawTaxGini = await d3.csv(pathForTaxGini, d => {return ({
    country:   d['Entity'],
    code:      d['Code'],
    year:      +d['Year'],
    gini:      d['Gini coefficient']  !== '' ? +d['Gini coefficient']  : null,
    taxPct:    d['Tax revenues (% of GDP)']   !== '' ? +d['Tax revenues (% of GDP)']   : null,
    continent: d['World region according to OWID'],
  })});

  const rawGDPPerCapita = await d3.csv(pathForGDPPerCapita, d => ({
    country:   d['Entity'],
    code:      d['Code'],
    year:      +d['Year'],
    gdpPerCapita: d['GDP per capita'] !== '' ? +d['GDP per capita'] : null,
  }));

//  console.log(`Loaded ${rawGDPPerCapita.length} rows (inkl. Zeilen mit nur einem Wert)`);

  const mapAddGDPPerCapita = rawTaxGini.map(d => {
    const gdpPerCapitaEntry = rawGDPPerCapita.find(g => g.country === d.country && g.year === d.year);
    return {
      ...d,
      gdpPerCapita: gdpPerCapitaEntry ? gdpPerCapitaEntry.gdpPerCapita : null
    };
  });


  const clean = mapAddGDPPerCapita.filter(d => d.year && d.country);
  console.log(`Loaded ${clean.length} rows (inkl. Zeilen mit nur einem Wert)`);
  
  return clean;
}