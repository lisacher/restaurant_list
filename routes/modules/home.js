// 引用 Express 與 Express 路由器 
const express = require('express')
const router = express.Router()

const Restaurants = require('../../models/restaurants')


//render index
router.get("/", (req, res) => {
  return Restaurants.find()
    .lean()
    .then(restaurants =>

      res.render("index", {
        pageTitle: "index",
        isIndex: true,
        restaurants: restaurants,
      })
    )
    .catch(() => console.log('index error'))

})

module.exports = router