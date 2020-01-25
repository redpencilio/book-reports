import { app, query } from 'mu';

app.get('/book-reports', async function( req, res ) {
  let reportsData = await getReports();
  let jsonData = reportsDataToJsonApiObject(reportsData);
  res.send( jsonData );
});

async function getReports(){
  const results = await query(`
    PREFIX ext: <http://mu.semte.ch/vocabularies/ext/>
    PREFIX mu: <http://mu.semte.ch/vocabularies/core/>
    PREFIX dct: <http://purl.org/dc/terms/>

    SELECT ?uri ?uuid ?created ?booksTotal WHERE {
      GRAPH <http://mu.semte.ch/application> {
         ?uri a ext:BookReport;
            mu:uuid ?uuid;
            dct:created ?created;
            ext:booksTotal ?booksTotal.
      }

    }
    ORDER BY DESC(?created)
  `);

  return results.results.bindings;
}

function reportsDataToJsonApiObject(reportsData){

  const entries = reportsData.map( reportData => {
    return {
      attributes: {
        created: reportData.created.value,
        uri: reportData.uri.value,
        'books-total': parseInt(reportData.booksTotal.value)
      },
      id: reportData.uuid.value,
      type: "book-report",
      relationships: {}
    };
  });

  return {
    data: entries,
    links: {
      "first": "/book-reports",
      "last": "/book-reports"
    }
  };
}
