const express = require('express');
const mongoose = require('mongoose')
const ShortUrl = require('./models/shortUrl')
const app = express();

mongoose.connect('mongodb://localhost/urlShortener', {
   useNewUrlParser: true, useUnifiedTopology: true
})

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true}))

app.get("/", async (req, res) => {
   const shortUrls = await ShortUrl.find()
   res.render('index', { shortUrls: shortUrls })
})

app.post('/shortUrls', async (req, res) => {
   await ShortUrl.create({ full: req.body.fullUrl })
   
   res.redirect('/');
})

app.get("/:shortUrl", async (req, res) => {
   const url = await ShortUrl.findOne({ short: req.params.shortUrl });
   if (url === null) return res.sendStatus(404);
   
   url.clicks++;
   url.save();
   
   res.redirect(url.full);
})

app.listen(process.env.PORT || 8000);