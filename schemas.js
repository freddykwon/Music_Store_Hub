const Joi = require('joi');

module.exports.storeSchema = Joi.object({
    store: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        image: Joi.string().required()
    }).required()
})