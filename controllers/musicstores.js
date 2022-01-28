const Store = require('../models/stores')
const { cloudinary } = require("../cloudinary")

module.exports.index = async (req, res) => {
    const musicstores = await Store.find({});
    res.render('musicstores/index', { musicstores })
}

module.exports.renderNewForm = (req, res) => {
    res.render('musicstores/new')
}

module.exports.createStore = async (req, res, next) => {

    const store = new Store(req.body.store)
    store.author = req.user._id;
    store.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    await store.save();
    console.log(store)
    req.flash('success', "Successfully added a new store!")
    res.redirect(`/musicstores/${store._id}`)
}

module.exports.showStore = async (req, res,) => {
    const store = await Store.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!store) {
        req.flash('error', 'Cannot find that store!');
        return res.redirect('/store');
    }
    res.render('musicstores/show', { store });
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const store = await Store.findById(id)
    if (!store) {
        req.flash('error', 'Cannot find that store!');
        return res.redirect('/musicstores');
    }
    res.render('musicstores/edit', { store });
}

module.exports.updateStore = async (req, res) => {
    const { id } = req.params;
    console.log(req.body)
    const store = await Store.findByIdAndUpdate(id, { ...req.body.store });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }))
    store.images.push(...imgs);
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await store.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    await store.save()
    req.flash('success', 'Successfully updated store!');
    res.redirect(`/musicstores/${store._id}`)
}

module.exports.deleteStore = async (req, res) => {
    const { id } = req.params;
    await Store.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted store')
    res.redirect('/musicstores');
}