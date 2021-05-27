const Subcategory = require("../model/subcat");
const { validationResult } = require('express-validator');
const { noImage, deleteFile } = require('../utils');
const { tryCatch } = require('../utils/tryCatch')
const { isnotImage } = require("../utils/validation")
const { isAdmin } = require('../middleware/admin')

// GET ALL CATEGORIES
exports.getSubCategories = (req, res, next) => {
    const page = +req.query.page || 1;
    const PER_PAGE = +req.query.per_page || 5;
    tryCatch(async () => {
        const totals = await Subcategory.find().countDocuments();
        const subcats = await Subcategory.find().select('-__v');
        if (!subcats) {
            return res.status(200).json({
                message: "No sub-category found",
                data: subcats
            })
        }
        return res.status(200).json({
            message: "No sub-category found",
            // totals: totals,
            // page: page,
            // next: page + 1,
            // prev: page - 1,
            // hasNext: Math.floor(totals / PER_PAGE),
            data: subcats.map(subcat => ({
                ...subcat._doc,
                image: noImage('uploads/subcategory/', subcat.image),
            }))
        })

    }, next)
}


// ADD CATEGORY
exports.addUpdateSubCategory = (req, res, next) => {
    const subcatId = req.params.subcatId;
    tryCatch(async () => {
        await isAdmin(req.user.userId, next);
        const errors = validationResult(req);
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

        const subcatExist = await Subcategory.findById(subcatId);

        if (subcatExist) {
            subcatExist.name = name;
            subcatExist.slug = slug;
            subcatExist.description = description;
            //subcatExist.category = category;
            if (image) {
                deleteFile(subcatExist.image);
                subcatExist.image = image.path
            }
            await subcatExist.save();
            return res.status(200).json({
                message: "Subcategory updated successfull.",
                data: {
                    ...subcatExist._doc,
                    image: noImage('uploads/subcategory/', subcatExist.image),
                }
            });
        } else {
            const isslug = await Subcategory.findOne({ slug: slug });
            if (isslug) {
                const error = new Error("Subcategory already existed");
                error.statusCode = 403;
                throw next(error)
            }
            const subcat = new Subcategory({
                name,
                description,
                slug,
                image: image ? image.path : "",
                //category: category
            });
            await subcat.save();
            return res.status(201).json({
                message: "Subcategory added successfully.",
                data: {
                    ...subcat._doc,
                    image: noImage('uploads/subcategory/', subcat.image),
                }
            });
        }
    }, next)
}

// UPLOAD CATEGORY
exports.uploadsubCategoryImage = (req, res, next) => {
    const subcatId = req.params.subcatId;
    tryCatch(async () => {
        await isAdmin(req.user.userId, next);
        const subcat = await Subcategory.findById(subcatId).select('-__v');
        const image = req.file;
        if (!subcat) {
            const error = new Error("subcategory not found");
            error.statusCode = 403;
            throw next(error)
        }

        isnotImage(image);

        if (image) {
            deleteFile(subcat.image);
            subcat.image = image.path;
        }

        await subcat.save();

        return res.status(200).json({
            message: "Category image uploaded successfully.",
            subcatId: subcatId,
            data: {
                ...subcat._doc,
                image: noImage('uploads/subcategory/', subcat.image),
            }
        });


    }, next)
}

// DELETE CATEGORY
exports.deleteSubcategory = (req, res, next) => {
    const subcatId = req.params.subcatId;
    tryCatch(async () => {
        await isAdmin(req.user.userId, next);
        const subcat = await Subcategory.findById(subcatId).select("-__v");
        if (!subcat) {
            const error = new Error("No category found");
            error.statusCode = 404;
            throw next(error)
        }

        if (subcat) {
            deleteFile(subcat.image);
        }
        await subcat.remove();
        return res.status(200).json({
            message: "Category deleted successfully!",
            data: subcat,
            id: subcatId
        })

    }, next)
}

// Active Category
exports.activesubCategory = (req, res, next) => {
    const subcatId = req.params.subcatId;
    tryCatch(async () => {
        await isAdmin(req.user.userId, next);
        const subcat = await Subcategory.findById(subcatId).select("-__v");
        if (!subcat) {
            const error = new Error("No category found");
            error.statusCode = 404;
            throw next(error)
        }

        if (subcat.active) {
            return res.status(200).json({
                message: "Category already activated!",
                subcatId: subcatId,
                data: {
                    ...subcat._doc,
                    image: noImage('uploads/subcategory/', subcat.image),
                }
            })
        }
        subcat.active = true;
        await subcat.save();
        return res.status(200).json({
            message: "Category activated successfully",
            recipeId: categoryId,
            data: {
                ...subcat._doc,
                image: noImage('uploads/subcategory/', subcat.image),
            }
        })

    }, next)
}

exports.deactivatesubCategory = (req, res, next) => {
    const subcatId = req.params.subcatId;
    tryCatch(async () => {
        await isAdmin(req.user.userId, next);
        const subcat = await Subcategory.findById(subcatId).select("-__v");
        if (!subcat) {
            const error = new Error("No category found");
            error.statusCode = 404;
            throw next(error)
        }
        if (!subcat.active) {
            return res.status(200).json({
                message: "Category already deactivated!",
                subcatId: subcatId,
                data: {
                    ...subcat._doc,
                    image: noImage('uploads/subcategory/', subcat.image),
                }
            })
        }
        subcat.active = false;
        await subcat.save();
        return res.status(200).json({
            message: "Category deactivated successfully",
            subcatId: subcatId,
            data: {
                ...subcat._doc,
                image: noImage('uploads/subcategory/', subcat.image),
            }
        })

    }, next)
}
