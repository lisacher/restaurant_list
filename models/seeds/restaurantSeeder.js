const Restaurant = require("../restaurants")
const data = require("../../restaurant.json").results

const db = require('../../config/mongoose')


db.once("open", () => {
  data.forEach((item) => {
    Restaurant.create({
      ...item,
    })
  })
  console.log("create restaurants data")
})