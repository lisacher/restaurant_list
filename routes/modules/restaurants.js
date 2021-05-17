const express = require("express")
const router = express.Router()
const Restaurants = require("../../models/restaurants")
// search 餐廳
router.get("/search", (req, res) => {
  const keyword = req.query.keyword
  return Restaurants.find()
    .lean()
    .then((restaurants) => {
      const filterList = restaurants.filter(
        (restaurant) =>
          restaurant.name.includes(keyword) ||
          restaurant.name_en.toLowerCase().includes(keyword.toLowerCase()) ||
          restaurant.category.toLowerCase().includes(keyword.toLowerCase())
      )
      res.render("index", {
        pageTitle: "index",
        isIndex: true,
        restaurants: filterList,
      })
    })
    .catch(() => console.log("search error"))
})
// sort by A-Z
router.get("/sort", (req, res) => {
  const keyword = req.query.type
  const sortType = {
    "A-Z": ["name_en", "asc","A-Z"],
    "Z-A": ["name_en", "desc","Z-A"],
    category: ["餐廳類型", "asc","類別"],
    location: ["location", "asc","地區"],
  }
  const [type, method,displayName] = sortType[keyword]
    Restaurants.find()
      .sort({ [type]: method })
      .lean()
      .then((restaurants) =>
        res.render("index", {
          pageTitle: "index",
          isIndex: true,
          restaurants,
          sort: displayName,
        })
      )
})

//新增餐廳
router.get("/new", (req, res) => {
  res.render("new")
})
router.post("/", (req, res) => {
  const {
    name,
    name_en,
    category,
    image,
    location,
    phone,
    google_map,
    rating,
    description,
  } = req.body
  const restaurant = req.body

  if (
    !name ||
    !name_en ||
    !category ||
    !image ||
    !location ||
    !phone ||
    !google_map ||
    !rating ||
    !description
  ) {
    return res.render("new", { restaurant,errorMessage: "每個欄位皆為必填" })
  }
  return Restaurants.create(req.body)
    .then(() => {
      console.log("create successfully")
      res.redirect("/")
    })
    .catch((error) => console.log("create error"))
})
// 餐廳詳細內容
router.get("/:id", (req, res) => {
  const id = req.params.id
  return Restaurants.findById(id)
    .lean()
    .then((restaurant) =>
      res.render("show", {
        pageTitle: restaurant.name,
        restaurant: restaurant,
      })
    )
    .catch((error) => console.log("detail error"))
})

//編輯餐廳
router.get("/:id/edit", (req, res) => {
  const id = req.params.id

  return Restaurants.findById(id)
    .lean()
    .then((restaurant) => {
      res.render("edit", { restaurant })
    })
    .catch((error) => console.log("edit error"))
})
router.put("/:id", (req, res) => {
  const data = Object.keys(req.body)
  const id = req.params.id
  const {
    name,
    name_en,
    category,
    image,
    location,
    phone,
    google_map,
    rating,
    description,
  } = req.body
  return Restaurants.findById(id)
    .then((restaurant) => {
      if (
        !name ||
        !name_en ||
        !category ||
        !image ||
        !location ||
        !phone ||
        !google_map ||
        !rating ||
        !description
      ) {
        return res.render("edit", { errorMessage: "每個欄位皆為必填" })
      }
      data.forEach((key) => {
        restaurant[key] = req.body[key]
      })
      return restaurant.save()
    })
    .then(() => res.redirect("/"))
    .catch((error) => console.log("put error"))
})
// 刪除餐廳
router.delete("/:id", (req, res) => {
  const id = req.params.id
  return Restaurants.findById(id)
    .then((restaurant) => {
      return restaurant.remove()
    })
    .then(() => res.redirect("/"))
    .catch((error) => console.log("delete error"))
})

module.exports = router