const Cuisine = require("../model/cuisine");
const { hasError, validationError } = require('../middleware/validation');
const { noImage, deleteFile } = require('../utils');
const { tryCatch } = require('../utils/tryCatch')
const { isnotImage } = require("../utils/validation");
const { isAdmin } = require('../middleware/admin');

/**
 * Get cuisines
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */

exports.getCuisines = function (req, res, next) {
  tryCatch(async () => {
    const filters = req.query;
    const Cuisines = await Cuisine.find();
    const filterdData = Cuisines.filter((data) => {
      let isValid = true;
      for (key in filters) {
        isValid = isValid && data[key] == filters[key];
      }
      return isValid;
    });
    return res.status(200).send(filterdData);
  }, next)
}

/**
 * Get cuisines
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */

exports.addUpdateCuisine = function (req, res, next) {
  tryCatch(async () => {
    validationError(req, next);
    await isAdmin(req.user.userId);
    const cuisineId = req.params.cuisineId;
    const { title } = req.body;
    const image = req.file;
    const slug = title.replace(/\s+/, -'').toLowerCase();
    const cuisine = await Cuisine.findById(cuisineId);

    if (cuisine) {
      cuisine.title = title;
      cuisine.slug = slug;
      if (image) {
        deleteFile(cuisine.image);
        cuisine.image = image.path;
      }
      cuisine.insertAt = Date.now();
      await cuisine.save();
      cuisine.image = noImage('uploads/cuisine/', cuisine.image)
      return res.status(200).send(cuisine);
    } else {
      const isCuisine = await Cuisine.findOne({ slug: slug });
      if (isCuisine) {
        hasError("Cuisine already exisisted", 400, next);
      }

      const cuisine = new Cuisine({
        title,
        slug,
        image: image ? image.path : ""
      })

      await cuisine.save();
      cuisine.image = noImage('uploads/cuisine/', cuisine.image)
      return res.status(201).send(cuisine);
    }

  }, next)
}

/**
 * Get cuisines
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */

exports.deleteCuisines = function (req, res, next) {
  tryCatch(async () => {
    await isAdmin(req.user.userId);
    const cuisineId = req.params.cuisineId;
    const cuisine = await cuisines.findById(cuisineId);
    if (!cuisine) {
      hasError("Cuisine not found", 404, next);
    }
    await cuisine.remove();
    return res.status(200).send(cuisine);
  }, next)
}