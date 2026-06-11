async function loadCSV(path) {
  const raw = await d3.csv(path, d => {return ({
    country:   d['Entity'],
    code:      d['Code'],
    year:      +d['Year'],
    gini:      d['Gini coefficient']  !== '' ? +d['Gini coefficient']  : null,
    taxPct:    d['Tax revenues (% of GDP)']   !== '' ? +d['Tax revenues (% of GDP)']   : null,
    continent: d['World region according to OWID'],
  })});

  const clean = raw.filter(d => d.year && d.country);
  console.log(`Loaded ${clean.length} rows (inkl. Zeilen mit nur einem Wert)`);
  return clean;
}