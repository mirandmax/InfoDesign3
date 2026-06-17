async function loadCSV(pathForTaxGini, pathForGDPPerCapita) {
  const rawTaxGini = await d3.csv(pathForTaxGini, d => {return ({
    country:   d['Entity'],
    code:      d['Code'],
    year:      +d['Year'],
    gini:      d['Gini coefficient']  !== '' ? +d['Gini coefficient']  : null,
    taxPct:    d['Tax revenues (% of GDP)']   !== '' ? +d['Tax revenues (% of GDP)']   : null,
    continent: d['World region according to OWID'],
  })});

  function fillMissingFieldsByNearbyYear(rows, fields, maxYearDistance = 15) {
    const rowsByCountry = d3.group(rows, d => d.country);

    return rows.map(row => {
      const candidates = rowsByCountry.get(row.country) || [];
      const filledRow = { ...row };

      for (const field of fields) {
        if (filledRow[field] !== null && filledRow[field] !== undefined && filledRow[field] !== '') {
          continue;
        }

        let bestCandidate = null;
        let bestDistance = Infinity;

        for (const candidate of candidates) {
          const candidateValue = candidate[field];
          if (candidateValue === null || candidateValue === undefined || candidateValue === '') {
            continue;
          }

          const distance = Math.abs(candidate.year - row.year);
          if (distance <= maxYearDistance && distance < bestDistance) {
            bestDistance = distance;
            bestCandidate = candidate;
          }
        }

        if (bestCandidate) {
          filledRow[field] = bestCandidate[field];
        }
      }

      return filledRow;
    });
  }


  const rawGDPPerCapita = await d3.csv(pathForGDPPerCapita, d => ({
    country:   d['Entity'],
    code:      d['Code'],
    year:      +d['Year'],
    gdpPerCapita: d['GDP per capita'] !== '' ? +d['GDP per capita'] : null,
  }));


  const mapAddGDPPerCapita = rawTaxGini.map(d => {
    const gdpPerCapitaEntry = rawGDPPerCapita.find(g => g.country === d.country && g.year === d.year);
    return {
      ...d,
      gdpPerCapita: gdpPerCapitaEntry ? gdpPerCapitaEntry.gdpPerCapita : null
    };
  });

  const filledData = fillMissingFieldsByNearbyYear(mapAddGDPPerCapita, ['code', 'gini', 'taxPct']);

  const clean = filledData.filter(d => d.year && d.country && d.continent);
  console.log(`Loaded ${clean.length} rows (inkl. Zeilen mit nur einem Wert)`);
  
  return clean;
}