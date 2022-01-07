const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const { storeSchema } = require('./schemas.js');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const Store = require('./models/stores')
const Review = require('./models/review');

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

const validateStore = (req, res, next) => {
    const { error } = storeSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

app.get('/', (req, res) => {
    res.render('home')
});

app.get('/musicstores', catchAsync(async (req, res) => {
    const musicstores = await Store.find({});
    res.render('musicstores/index', { musicstores })
}));

app.get('/musicstores/new', (req, res) => {
    res.render('musicstores/new');
})

app.post('/musicstores', validateStore, catchAsync(async (req, res, next) => {
    const store = new Store(req.body.store)
    console.log(store)
    await store.save();
    res.redirect(`/musicstores/${store._id}`)
}))

app.get('/musicstores/:id', catchAsync(async (req, res) => {
    const store = await Store.findById(req.params.id)
    res.render('musicstores/show', { store });
}));

app.get('/musicstores/:id/edit', catchAsync(async (req, res) => {
    const store = await Store.findById(req.params.id)
    res.render('musicstores/edit', { store });
}))

app.put('/musicstores/:id', validateStore, catchAsync(async (req, res) => {
    const { id } = req.params;
    const store = await Store.findByIdAndUpdate(id, { ...req.body.store })
    res.redirect(`/musicstores/${store._id}`)
}));

app.delete('/musicstores/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Store.findByIdAndDelete(id);
    res.redirect('/musicstores');
}));

app.post('/musicstores/:id/reviews', catchAsync(async (req, res) => {
    const store = await Store.findById(req.params.id);
    const review = new Review(req.body.review);
    store.reviews.push(review);
    await review.save()
    await store.save()
    res.redirect(`/musicstores/${store._id}`);
}));

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
})

app.use((err, req, res, next) => {
    const { statusCode = 500, message = 'Something Went Wrong' } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err });
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
})



