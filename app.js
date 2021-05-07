//載入工具
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const Restaurant = require('./models/restaurant')

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
})

//套入樣板引擎
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

//設定靜態檔案
app.use(express.static('public'))

//設定 body-parser
app.use(bodyParser.urlencoded({ extended: true }))

//設定首頁路由
app.get('/', (req, res) => {
  Restaurant.find() //取出 restaurant model 中的所有資料
    .lean() //把 Mongoose 的 model物件轉換成乾淨的 Javascript 資料陣列
    .then(restaurants => res.render('index', { restaurants })) //把資料傳送給index
    .catch(error => console.log(error))
})

//設定 show 頁面路由
app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('show', { restaurant }))
    .catch(error => console.log(error))
})

//設定 new 頁面路由
app.get('/new', (req, res) => {
  return res.render('new')
})

//設定 Create 路由
app.post('/restaurants', (req, res) => {
  const newRestaurant = req.body
  return Restaurant.create(newRestaurant)
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

//設定 edit 頁面路由
app.get('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('edit', { restaurant }))
    .catch(error => console.log(error))
})

//設定 edit 餐廳資料
app.post('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id
  const editRestaurant = req.body
  return Restaurant.findByIdAndUpdate(id, editRestaurant)
    .then(() => res.redirect(`/restaurants/${id}`))
    .catch(error => console.log(error))
})

//設定 delete路由
app.post('/restaurants/:id/delete', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

//設定搜尋路由
app.get('/search', (req, res) => {
  const keyword = req.query.keyword
  const newRegExp = RegExp(keyword, 'i')
  return Restaurant.find({
    $or: [{ name: newRegExp }, { category: newRegExp }]
  })
    .lean()
    .then(restaurants => res.render('index', { restaurants, keyword }))

})

//設定監聽器
app.listen(3000, () => {
  console.log('App is running on http://localhost:3000')
})
