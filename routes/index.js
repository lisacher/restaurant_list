const express = require("express");
const home = require("./modules/home");
const restaurants = require("./modules/restaurants");

const router = express.Router();

// router.use("/sort", sort);
router.use("/restaurants", restaurants);
router.use("/", home);

module.exports = router