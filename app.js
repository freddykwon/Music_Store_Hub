const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const Store = require('./models/stores')
const methodOverride = require('method-override');

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

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'));


app.get('/', (req, res) => {
    res.render('home')
})

app.get('/musicstores', async (req, res) => {
    const musicstores = await Store.find({});
    res.render('musicstores/index', { musicstores })
});

app.get('/makestores', async (req, res) => {
    const store = new Store({ title: 'Long & Mcquade', description: "Canada's biggest music store!" })
    await store.save();
    res.send(store);
})

app.get('/musicstores/new', (req, res) => {
    res.render('musicstores/new')
})

app.post('/musicstores', async (req, res) => {
    const store = new Store(req.body.store)
    await store.save();
    res.redirect(`/musicstores/${store._id}`)
})

app.get('/musicstores/:id', async (req, res) => {
    const store = await Store.findById(req.params.id)
    res.render('musicstores/show', { store });
});

app.get('/musicstores/:id/edit', async (req, res) => {
    const store = await Store.findById(req.params.id)
    res.render('musicstores/edit', { store });
})

app.put('/musicstores/:id', async (req, res) => {
    const { id } = req.params;
    const store = await Store.findByIdAndUpdate(id, { ...req.body.store })
    res.redirect(`/musicstores/${store._id}`)
});

app.delete('/musicstores/:id', async (req, res) => {
    const { id } = req.params;
    await Store.findByIdAndDelete(id);
    res.redirect('/musicstores');
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
})