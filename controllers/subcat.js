const Subcategory = require("../model/subcat");
const { validationError } = require('../middleware/validation');
const { noImage, deleteFile } = require('../utils');
const { isnotImage } = require("../utils/validation")
const { isAdmin } = require('../middleware/admin')

// GET ALL CATEGORIES
exports.getSubCategories = async (req, res, next) => {
    try {
        const filters = req.query;
        const data = await Subcategory.find().populate('category');
        console.log(data)
        const filterdData = data.filter((data) => {
            let isValid = true;
            for (key in filters) {
                isValid = isValid && data[key] == filters[key];
            }
            return isValid;
        });
        for (let i in filterdData) {
            filterdData[i].image = noImage('uploads/subcat/', filterdData[i].image);
        }
        return res.status(200).send(filterdData)
    } catch (err) {
        next(err)
    }
}


// ADD CATEGORY
exports.addUpdateSubCategory = async (req, res, next) => {
    try {

        const subcatId = req.params.subcatId;
        validationError(req, next);
        await isAdmin(req.user.userId, next);
        const { title, description, category } = req.body;
        let image = req.file;
        let slug = title.replace(/\s+/, '-').toLowerCase();
        const subcatExist = await Subcategory.findById(subcatId);

        if (subcatExist) {
            subcatExist.title = title;
            subcatExist.slug = slug;
            subcatExist.description = description;
            subcatExist.category = category;
            if (image) {
                deleteFile(subcatExist.image);
                subcatExist.image = image.path
            }
            await subcatExist.save();
            await subcatExist.save();
            subcatExist.image = noImage('uploads/subcat/', subcatExist.image)
            return res.status(200).send(subcatExist);
        } else {
            const isslug = await Subcategory.findOne({ slug: slug });
            if (isslug) {
                const error = new Error("Subcategory already existed");
                error.statusCode = 403;
                deleteFile(image.path);
                throw next(error)
            }
            const subcat = new Subcategory({
                title,
                slug,
                description,
                image: image ? image.path : "",
                category
            });
            await subcat.save();
            subcat.image = noImage('uploads/subcat/', subcat.image)
            return res.status(201).send(subcat);
        }
    } catch (err) {
        deleteFile(req.file.path);
        next(err)
    }
}

// UPLOAD CATEGORY
exports.uploadsubCategoryImage = async (req, res, next) => {
    try {
        await isAdmin(req.user.userId, next);
        const subcatId = req.params.subcatId;
        const subcat = await Subcategory.findById(subcatId);
        const image = req.file;
        if (!subcat) {
            deleteFile(image.path);
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
        subcat.image = noImage('uploads/subcat/', subcat.image)
        return res.status(200).send(subcat);

    } catch (err) {
        deleteFile(req.file.path);
        next(err)
    }
}

// DELETE CATEGORY
exports.deleteSubcategory = async (req, res, next) => {
    try {
        await isAdmin(req.user.userId, next);
        const subcatId = req.params.subcatId;
        const subcat = await Subcategory.findById(subcatId)
        if (!subcat) {
            const error = new Error("No category found");
            error.statusCode = 404;
            throw next(error)
        }
        if (subcat) {
            deleteFile(subcat.image);
        }
        await subcat.remove();
        subcat.image = noImage('uploads/subcat/', subcat.image)
        return res.status(200).send(subcat);
    } catch (err) {
        next(err)
    }
}

// Active Category
exports.activesubCategory = async (req, res, next) => {
    const subcatId = req.params.subcatId;
    try {
        await isAdmin(req.user.userId, next);
        const subcat = await Subcategory.findById(subcatId);
        if (!subcat) {
            const error = new Error("No category found");
            error.statusCode = 404;
            throw next(error)
        }
        subcat.active = true;
        await subcat.save();
        subcat.image = noImage('uploads/subcat/', subcat.image)
        return res.status(200).send(subcat);
    } catch (err) {
        next(err)
    }
}

exports.deactivatesubCategory = async (req, res, next) => {
    const subcatId = req.params.subcatId;
    try {
        await isAdmin(req.user.userId, next);
        const subcat = await Subcategory.findById(subcatId);
        if (!subcat) {
            const error = new Error("No category found");
            error.statusCode = 404;
            throw next(error)
        }
        subcat.active = false;
        await subcat.save();
        subcat.image = noImage('uploads/subcat/', subcat.image)
        return res.status(200).send(subcat);
    } catch (err) {
        next(err)
    }
}
