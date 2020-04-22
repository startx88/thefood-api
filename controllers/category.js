const Category = require("../model/category");
const { validationResult } = require('express-validator');
const { deleteFile } = require('../utils/file');
const { tryCatch } = require('../utils/tryCatch')

// GET ALL CATEGORIES
exports.getCategories = (req, res, next) => {

}

exports.addUpdateCategory = (req, res, next) => {
    const categoryId = req.params.categoryId;
    tryCatch(async () => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = new Error(errors.array()[0].msg);
            error.statusCode = 403;
            throw next(error)
        }
        const { name, description } = req.body;
        let slug = req.body.slug;
        if (slug === "") {
            slug = name.replace(/\s+/, '-').toLowerCase();
        }

        const category = new Category({
            name,
            description,
            slug
        })

    }, next)
}


exports.uploadImage = (req, res, next) => {

}

exports.deleteCategory = (req, res, next) => {

}

exports.activeCategory = (req, res, next) => {

}

exports.deactivateCategory = (req, res, next) => {

}

exports.getCategory = (req, res, next) => {

}