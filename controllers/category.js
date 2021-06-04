const Category = require("../model/category");
const { validationError, hasError } = require('../middleware/validation');
const { noImage, deleteFile } = require('../utils');
const { isnotImage } = require("../utils/validation");

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

// get categories by restaurant
exports.getCategoryByRestaurantId = async (req, res, next) => {
    try {
        const restaurant = req.params.restarantId;
        const categories = await Category.find({ restaurant });
        if (!categories) {
            return res.status(200).send([]);
        }
        for (let i in categories) {
            categories[i].image = noImage('uploads/category/', categories[i].image);
        }
        return res.status(200).send(categories)
    } catch (err) {
        next(err)
    }
}

// ADD CATEGORY 
exports.addUpdateCategory = async (req, res, next) => {
    try {

        validationError(req, next);
        const categoryId = req.params.categoryId;
        const restaurant = req.params.restaurantId;
        const { title, description } = req.body;
        let image = req.file;
        const categoryExist = await Category.findOne({ _id: categoryId, restaurant });
        const slug = title.replace(/\s+/, '-').toLowerCase();
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
            const hasCategory = await Category.findOne({ slug: slug });
            if (hasCategory) {
                const error = new Error("Category already existed");
                error.statusCode = 403;
                throw next(error)
            }
            const category = new Category({
                restaurant,
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
    try {
        const categoryId = req.params.categoryId;
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
    try {
        const categoryId = req.params.categoryId;
        const restaurantId = req.params.restaurantId;
        const category = await Category.findOne({ _id: categoryId, restaurant: restaurantId });

        if (!category) {
            const error = new Error('Category not fund');
            error.statusCode = 404;
            next(error)
        }
        if (category) deleteFile(category.image);
        await category.remove();
        return res.status(200).send(category);
    } catch (err) {
        next(err)
    }
}

// Active Category
exports.activeDeactiveCategory = async (req, res, next) => {
    try {
        const categoryId = req.params.categoryId;
        const restaurant = req.params.restaurantId;
        const category = await Category.findOne({ _id: categoryId, restaurant });

        if (!category) {
            const error = new Error('Category not fund');
            error.statusCode = 404;
            next(error)
        }
        category.active = !category.active;
        await category.save();
        category.image = noImage('uploads/category/', category.image)
        return res.status(200).send(category);
    } catch (err) {
        next(err)
    }
}

