const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Stores = require('./models/stores')

mongoose.connect('mongodb://localhost:27017/music-stores', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/makestore', async (req, res) => {
    const store = new Stores({ title: 'Long & Mcquade', description: "Canada's biggest music store!" })
    await store.save();
    res.send(store);
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
})