const express = require("express")

const exphbs = require("express-handlebars")
const methodOverride = require('method-override')
const bodyParser = require('body-parser')

const router = require('./routes/index')
require('./config/mongoose')

const app = express()

const port = 3000

app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(express.static("public"))
app.engine("hbs", exphbs({ defaultLayout: "main", extname: "hbs" }))
app.set("view engine", "hbs")


app.use(router)

app.listen(port, () => {
  console.log(`operate http://localhost:${port} successfully`)
})