/* eslint-disable */
const { exec } = require('child_process')
const thegraphConfig = require('./relay_thegraph.config')
/* eslint-enable */

function fetchSchema(url, outputFile) {
  exec(
    `get-graphql-schema ${url} | tee ${outputFile}.temp`,
    (error, stdout, stderr) => {
      if (error || stderr) {
        console.log(`Failed to fetch schema from ${url}`)
      } else if (stdout) {
        exec(`mv ${outputFile}.temp ${outputFile}`)
      }
    }
  )
}

fetchSchema("https://api.thegraph.com/subgraphs/name/spsina/dibs", thegraphConfig.schema)
