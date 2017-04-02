// Load dotenv.
var dotenv = require('dotenv')
dotenv.load()

var config = require('./config')
var charge = require('./stripe')

var app = require('./server')

app.get('/', (req, res) => {
  return res.redirect(config.homeUrl)
})

app.get('/status', (req, res) => {
  return res.send(`🤘 since ${app.get('startTime')}`)
})

app.post('/donate', (req, res) => {
  const payload = { amount, email, monthly, token } = req.body

  charge(payload).then(payment => (
    res.json(payment)
  )).catch(err => {
    res.status(err.response.status).send(err.response.statusText)
  })
})

const host = app.get('host')
const port = app.get('port')
app.listen(port, () => {
  console.log(`Running at ${host}: ${port}`)
})
