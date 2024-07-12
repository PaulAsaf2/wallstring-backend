const express = require("express")
const cors = require("cors")
const crypto = require("crypto")
require('dotenv').config()
const app = express()
const port = process.env.PORT || 3002

app.use(cors())
app.use(express.text())

app.post('/check-initdata', (req, res) => {
  const params = new URLSearchParams(req.body)
  const parsedData = {}

  for (const [key, value] of params.entries()) {
    parsedData[key] = value
  }

  const hash = parsedData['hash']
  delete parsedData['hash']

  const dataCheckString = Object.keys(parsedData)
    .sort()
    .map((key) => `${key}=${parsedData[key]}`)
    .join('\n')

  const token = process.env.BOT_TOKEN

  const secretKey = crypto
    .createHmac('sha256', 'WebAppData')
    .update(token)
    .digest()

  const hmac = crypto
    .createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex')

  if (hmac == hash) {
    res.status(200).send({ initData: parsedData })
  } else {
    res.status(400).send({ error: 'Data is invalid' })
  }
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
})