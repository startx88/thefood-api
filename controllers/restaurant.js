const Restaurant = require('../model/restaurant');
const Auth = require("../model/auth");
const { hasError, validationError } = require('../middleware/validation');
const { noImage, deleteFile } = require('../utils');
const { isVendor } = require('../middleware/vendor')


// get all restaurant
exports.getAllRestaurants = async function (req, res, next) {
  try {
    const page = +req.query.page || 1;
    const limit = req.query.limit !== "undefined" ? +req.query.limit || 6 : 0;
    const total = await Restaurant.find().countDocuments();
    const Restaurants = await Restaurant
      .find()
      .sort({ title: 1 })
      .limit(limit)
      .skip((page - 1) * limit);

    return res.status(200).json({
      total: total,
      currentPage: page,
      totalPage: Math.ceil(total / limit),
      next: page + 1,
      prev: page - 1,
      hasNext: page * limit < total,
      hasPrev: page > 1,
      data: Restaurants.map((item) => ({
        ...item._doc,
        image: noImage('uploads/restaurants/', item.image)
      }))
    });
  } catch (err) { next(err) }
}


// get restaurant
exports.getMyRestaurant = async function (req, res, next) {
  try {
    await isVendor(req.user.userId, next);
    const userId = req.user.userId;

    const restaurant = await Restaurant.findOne({ user: userId });
    if (!restaurant) {
      throw new Error("There is no restaurant");
    }

    return res.status(200).json({
      message: 'Restaurant data fetched!',
      id: restaurant._id,
      data: {
        ...restaurant._doc,
        image: noImage('uploads/restaurants/', restaurant.image)
      }
    })

  } catch (err) { next(err) }
}


// get restaurant
exports.getRestaurant = async function (req, res, next) {
  try {
    const Id = req.params.id;
    const restaurant = await Restaurant.findById(Id);
    if (!restaurant) {
      throw new Error("There is no restaurant");
    }

    return res.status(200).json({
      message: 'Restaurant data fetched!',
      restaurantId: Id,
      data: {
        ...restaurant._doc,
        image: noImage('uploads/restaurants/', restaurant.image)
      }
    })

  } catch (err) { next(err) }
}

// add / udpate addUpdateRestaurant
exports.addUpdateRestaurant = async function (req, res, next) {
  try {
    await isVendor(req.user.userId, next);
    validationError(req, next);
    const Id = req.params.id;
    const { name, costFor, type, landline, address } = req.body;
    const image = req.image;
    const restaurant = await Restaurant.findById(Id);
    const user = await Auth.findById(req.user.userId);
    const isRestaurantExist = await Restaurant.findOne({ user: req.user.userId })

    if (restaurant) {
      restaurant.type = type;
      restaurant.landline = landline;
      if (image) {
        deleteFile(restaurant.image);
        restaurant.image = image.path;
      }
      await restaurant.save();
      return res.status(200).json({
        message: "Restaurant updated",
        id: Id,
        data: restaurant
      })
    } else {
      if (isRestaurantExist) {
        throw new Error("Restaurant already existed!");
      }
      const newRestro = new Restaurant({
        user: req.user.userId,
        name: name,
        type: type,
        ownerName: user.firstname + '' + user.lastname,
        landline: landline,
        mobile: user.mobile,
        image: image ? image.path : "",
        costFor: costFor,
        address: address
      });
      await newRestro.save();
      return res.status(200).json({
        message: "Restaurants addedd successfully",
        id: newRestro._id,
        data: newRestro
      })
    }
  } catch (err) { next(err) }
}


/**
 *  Add Restaurant banner image
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
exports.addRestaurantBanner = async function (req, res, next) {
  try {
    await isVendor(req.user.userId, next);
    const image = req.file;
    const restarantId = req.params.restarantId;
    const userId = req.user.userId;
    const restaurant = await Restaurant.findOne({ user: userId, _id: restarantId });
    if (!restaurant) {
      deleteFile(image.path)
      throw new Error("Restaurant not found");
    }
    if (!image) {
      deleteFile(image.path)
      throw new Error("Please select restaurant hero image");
    }
    if (image) {
      deleteFile(restaurant.avatar);
      restaurant.avatar = image.path;
    }
    await restaurant.save();
    return res.status(200).json({
      message: "Restaurant hero image updated successfully",
      id: restaurant._id,
      data: restaurant
    });
  }
  catch (err) {
    deleteFile(req.file.path);
    next(err)
  }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.addMenus = async function (req, res, next) {
  try {
    await isVendor(req.user.userId, next);
    validationError(req, next)
    const restarantId = req.params.restarantId;
    const menuId = req.params.menuId;
    const userId = req.user.userId;
    const isRestaurantExist = await Restaurant.findOne({ user: userId, _id: restarantId });
    const { title } = req.body;

    if (!isRestaurantExist) {
      throw new Error("Restaurant is not existed");
    }

    const menus = isRestaurantExist.menus;
    const slug = title.replace(/\s+/, '-').toLowerCase();
    const isMenuExist = menus.find(x => x._id == menuId);
    if (isMenuExist) {
      const index = menus.findIndex(x => x._id == menuId);
      const menu = menus[index];
      menu.title = title;
      menu.slug = slug;
      menus[index] = menu;
    } else {
      const menu = menus.find(x => x.slug === slug);
      if (menu) {
        throw new Error("Menu already existed");
      }
      menus.push({ title: title, slug: slug });
    }
    await isRestaurantExist.save();
    return res.status(200).json({
      message: "Menu added successfully",
      data: isRestaurantExist
    })
  }
  catch (err) {
    next(err)
  }
}