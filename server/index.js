// server/index.js

const express = require("express")
const http = require("http")
const https = require("https")

const PORT = process.env.PORT || 3001

const app = express()

const method = "/search.php?s=Arrabiata"

const options = {
  host: "www.themealdb.com",
  port: 443,
  path: "/api/json/v1/1" + method,
  method: "GET",
  headers: {
    "Content-Type": "application/json"
  }
}

/**
 * getJSON:  RESTful GET request returning JSON object(s)
 * @param options: http options object
 * @param callback: callback to pass the results JSON object(s) back
 */

module.exports.getJSON = (options, onResult) => {
  console.log('rest::getJSON')
  const port = options.port == 443 ? https : http

  let output = ''

  const req = port.request(options, (res) => {
    console.log(`${options.host} : ${res.statusCode}`)
    res.setEncoding('utf8')

    res.on('data', (chunk) => {
      output += chunk
    })

    res.on('end', () => {
      let obj = JSON.parse(output)

      onResult(res.statusCode, obj)
    })
  })

  req.on('error', (err) => {
    res.send('error: ' + err.message)
  })

  req.end()
}

app.get("/api", (req, res) => {
  this.getJSON(options, (statusCode, result) => {
    console.log(`onResult: (${statusCode})`)

    res.statusCode = statusCode
    res.json({ result })
  })
})

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`)
})