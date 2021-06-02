const Category = require("../model/category");
const { validationError } = require('../middleware/validation');
const { noImage, deleteFile } = require('../utils');
const { isnotImage } = require("../utils/validation");
const { isAdmin } = require('../middleware/admin');

// GET ALL CATEGORIES
exports.getCategories = async (req, res, next) => {
    try {
        const filters = req.query;
        const categories = await Category.find();
        const filterdData = categories.filter((data) => {
            let isValid = true;
            for (key in filters) {
                isValid = isValid && data[key] == filters[key];
            }
            return isValid;
        });
        for (let i in filterdData) {
            filterdData[i].image = noImage('uploads/category/', filterdData[i].image);
        }
        return res.status(200).send(filterdData)

    } catch (err) {
        next(err)
    }
}


// ADD CATEGORY
exports.addUpdateCategory = async (req, res, next) => {
    try {
        const categoryId = req.params.categoryId;
        validationError(req, next);
        await isAdmin(req.user.userId, next);
        const { title, description } = req.body;
        let image = req.file;
        const slug = title.replace(/\s+/, '-').toLowerCase();
        const categoryExist = await Category.findById(categoryId);
        if (categoryExist) {
            categoryExist.title = title;
            categoryExist.slug = slug;
            categoryExist.description = description;
            categoryExist.insertAt = Date.now();
            if (image) {
                deleteFile(categoryExist.image);
                categoryExist.image = image.path
            }
            const result = await categoryExist.save();
            categoryExist.image = noImage('uploads/category/', categoryExist.image)
            return res.status(200).send(result);
        } else {
            const isslug = await Category.findOne({ slug: slug });
            if (isslug) {
                const error = new Error("category already existed");
                error.statusCode = 403;
                throw next(error)
            }
            const category = new Category({
                title,
                description,
                slug,
                image: image ? image.path : ""
            });
            const result = await category.save();
            category.image = noImage('uploads/category/', result.image)
            return res.status(201).send(result);
        }
    } catch (err) {
        deleteFile(req.file.path);
        next(err)
    }
}

// UPLOAD CATEGORY
exports.uploadCategoryImage = async (req, res, next) => {
    const categoryId = req.params.categoryId;
    try {
        await isAdmin(req.user.userId, next);
        const category = await Category.findById(categoryId).select('-__v');
        const image = req.file;
        if (!category) {
            deleteFile(image.path);
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
        category.image = noImage('uploads/category/', category.image)
        return res.status(200).send(category);
    } catch (err) {
        deleteFile(req.file.path);
        next(err)
    }
}

// DELETE CATEGORY
exports.deleteCategory = async (req, res, next) => {
    const categoryId = req.params.categoryId;
    try {
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
        category.image = noImage('uploads/category/', category.image)
        return res.status(200).send(category);
    } catch (err) {
        next(err)
    }
}

// Active Category
exports.activeCategory = async (req, res, next) => {
    const categoryId = req.params.categoryId;
    try {
        await isAdmin(req.user.userId, next);
        const category = await Category.findById(categoryId).select("-__v");
        if (!category) {
            const error = new Error("No category found");
            error.statusCode = 404;
            throw next(error)
        }

        category.active = true;
        await category.save();
        category.image = noImage('uploads/category/', category.image)
        return res.status(200).send(category);

    } catch (err) {
        next(err)
    }
}

exports.deactivateCategory = async (req, res, next) => {
    const categoryId = req.params.categoryId;
    try {
        await isAdmin(req.user.userId, next);
        const category = await Category.findById(categoryId).select("-__v");
        if (!category) {
            const error = new Error("No category found");
            error.statusCode = 404;
            throw next(error)
        }
        category.active = false;
        await category.save();
        category.image = noImage('uploads/category/', category.image)
        return res.status(200).send(category);
    } catch (err) {
        next(err)
    }
}
