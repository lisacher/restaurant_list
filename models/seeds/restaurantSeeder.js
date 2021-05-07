const mongoose = require('mongoose')
const Restaurant = require('../restaurant') //載入restaurant model
const restaurantList = require('./restaurant.json') //載入json檔案為種子資料

//設定連線到mongodb
mongoose.connect('mongodb://localhost/restaurant-list', { useNewUrlParser: true, useUnifiedTopology: true })

//取得資料庫連線狀態
const db = mongoose.connection

//連線異常
db.on('err', () => {
  console.log('mongodb error!')
})

//連線成功
db.once('open', () => {
  console.log('mongodb connected!')

  //新增餐廳資料
  for (let i = 0; i < restaurantList.results.length; i++) {
    Restaurant.create(restaurantList.results[i])
  }
  console.log('done')
})