const Category = require("../model/category");
const { validationResult } = require('express-validator');
const { deleteFile } = require('../utils/file');
const { tryCatch } = require('../utils/tryCatch')
const { isnotImage } = require("../utils/validation");
const { isAdmin } = require('../middleware/admin')
// GET ALL CATEGORIES
exports.getCategories = (req, res, next) => {
    const page = +req.query.page || 1;
    const PER_PAGE = +req.query.per_page || 5;
    tryCatch(async () => {
        const totals = await Category.find().countDocuments();
        const categories = await Category.find().select('-__v');
        if (!categories) {
            return res.status(200).json({
                message: "No category found",
                data: categories
            })
        }
        return res.status(200).json({
            message: "No category found",
            totals: totals,
            page: page,
            next: page + 1,
            prev: page - 1,
            hasNext: Math.floor(totals / PER_PAGE),
            data: categories.map(cat => ({
                ...cat._doc,
                image: 'http://localhost:5000/' + cat.image,
                api: {
                    url: 'http://localhost:5000' + req.baseUrl,
                    method: req.method
                },
            }))
        })

    }, next)
}


// ADD CATEGORY
exports.addUpdateCategory = (req, res, next) => {
    const categoryId = req.params.categoryId;
    tryCatch(async () => {
        const errors = validationResult(req);
        await isAdmin(req.user.userId, next);
        if (!errors.isEmpty()) {
            const error = new Error(errors.array()[0].msg);
            error.statusCode = 403;
            throw next(error)
        }
        const { name, description } = req.body;
        let slug = req.body.slug;
        let image = req.file;
        if (slug === "") {
            slug = name.replace(/\s+/, '-').toLowerCase();
        }

        const categoryExist = await Category.findById(categoryId);

        if (categoryExist) {
            categoryExist.name = name;
            categoryExist.slug = slug;
            categoryExist.description = description;
            if (image) {
                deleteFile(categoryExist.image);
                categoryExist.image = image.path
            }
            const result = await categoryExist.save();
            return res.status(200).json({
                message: "Category updated successfull.",
                data: {
                    ...result._doc,
                    categoryId: categoryId,
                    image: 'http://localhost:5000/' + result.image
                }
            });
        } else {
            const isslug = await Category.findOne({ slug: slug });
            if (isslug) {
                const error = new Error("category already existed");
                error.statusCode = 403;
                throw next(error)
            }
            const category = new Category({
                name,
                description,
                slug,
                image: image ? image.path : ""
            });
            const result = await category.save();
            return res.status(201).json({
                message: "Category added successfully.",
                data: {
                    ...result._doc,
                    image: 'http://localhost:5000/' + result.image
                }
            });
        }
    }, next)
}

// UPLOAD CATEGORY
exports.uploadCategoryImage = (req, res, next) => {
    const categoryId = req.params.categoryId;
    tryCatch(async () => {
        await isAdmin(req.user.userId, next);
        const category = await Category.findById(categoryId).select('-__v');
        const image = req.file;
        if (!category) {
            const error = new Error("category not found");
            error.statusCode = 403;
            throw next(error)
        }

        isnotImage(image);

        if (image) {
            deleteFile(category.image);
            category.image = image.path;
        }

        await category.save();

        return res.status(200).json({
            message: "Category image uploaded successfully.",
            categoryId: categoryId,
            data: {
                ...category._doc,
                image: 'http://localhost:5000/' + category.image
            }
        });


    }, next)
}

// DELETE CATEGORY
exports.deleteCategory = (req, res, next) => {
    const categoryId = req.params.categoryId;
    tryCatch(async () => {
        await isAdmin(req.user.userId, next);
        const category = await Category.findById(categoryId).select("-__v");
        if (!category) {
            const error = new Error("No category found");
            error.statusCode = 404;
            throw next(error)
        }

        if (category) {
            deleteFile(category.image);
        }
        await category.remove();
        return res.status(200).json({
            message: "Category deleted successfully!",
            data: category,
            categoryId: categoryId
        })

    }, next)
}

// Active Category
exports.activeCategory = (req, res, next) => {
    console.log('activate')
    const categoryId = req.params.categoryId;
    tryCatch(async () => {
        await isAdmin(req.user.userId, next);
        const category = await Category.findById(categoryId).select("-__v");
        if (!category) {
            const error = new Error("No category found");
            error.statusCode = 404;
            throw next(error)
        }

        if (category.active) {
            return res.status(200).json({
                message: "Category already activated!",
                categoryId: categoryId,
                data: {
                    ...category._doc,
                    image: 'http://localhost:5000/' + category.image
                }
            })
        }
        category.active = true;
        await category.save();
        return res.status(200).json({
            message: "Category activated successfully",
            categoryId: categoryId,
            data: {
                ...category._doc,
                image: 'http://localhost:5000/' + category.image
            }
        })

    }, next)
}

exports.deactivateCategory = (req, res, next) => {
    const categoryId = req.params.categoryId;
    tryCatch(async () => {
        await isAdmin(req.user.userId, next);
        const category = await Category.findById(categoryId).select("-__v");
        if (!category) {
            const error = new Error("No category found");
            error.statusCode = 404;
            throw next(error)
        }
        if (!category.active) {
            return res.status(200).json({
                message: "Category already deactivated!",
                categoryId: categoryId,
                data: {
                    ...category._doc,
                    image: 'http://localhost:5000/' + category.image
                }
            })
        }
        category.active = false;
        await category.save();
        return res.status(200).json({
            message: "Category deactivated successfully",
            categoryId: categoryId,
            data: {
                ...category._doc,
                image: 'http://localhost:5000/' + category.image
            }
        })

    }, next)
}
