const Auth = require("../model/auth");
const Restaurant = require('../model/restaurant');
const { hasError, validationError } = require('../middleware/validation');
const { noImage, deleteFile, hasNoImage } = require('../utils');
const { isVendor } = require('../middleware/vendor')
const { isAdmin } = require('../middleware/admin')

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
      message: "Restaurants fetched successfully",
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


/**
 * Get Restaurant by id
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
exports.getRestaurant = async function (req, res, next) {
  try {
    const Id = req.params.id;
    const restaurant = await Restaurant.findById(Id);
    if (!restaurant) {
      throw new Error("There is no restaurant");
    }
    return res.status(200).json({
      message: 'Restaurant data fetched!',
      id: Id,
      data: {
        ...restaurant._doc,
        image: noImage('uploads/restaurants/', restaurant.image)
      }
    })

  } catch (err) { next(err) }
}

// get restaurant
exports.getMyRestaurant = async function (req, res, next) {
  try {
    const userId = req.user.userId;
    await isVendor(req.user.userId, next);
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




// add / udpate addUpdateRestaurant
exports.addUpdateRestaurant = async function (req, res, next) {
  try {
    validationError(req, next);
    await isVendor(req.user.userId, next);
    const Id = req.params.id; // update id
    const {
      name,
      mobile,
      landline,
      owener,
      manager,
      orderContact,
      restaurantType,
      yearOfBirth,
      establistmentType,
      cuisines,
      openTime,
      closeTime,
      daysOpenInWeek,
      costFor,
      address
    } = req.body;
    const image = req.image;
    const menuImage = req.menuImage;
    const user = await Auth.findById(req.user.userId);
    const restaurant = await Restaurant.findById(Id);
    const isRestaurantExist = await Restaurant.findOne({ user: req.user.userId });

    hasNoImage(image);

    if (restaurant) {
      restaurant.name = name;
      restaurant.mobile = mobile;
      restaurant.landline = landline;
      restaurant.ownerName = owener;
      restaurant.manager = manager;
      restaurant.orderContact = orderContact;
      restaurant.restaurantType = restaurantType;
      restaurant.yearOfBirth = yearOfBirth;
      restaurant.establistmentType = establistmentType;
      restaurant.cuisines = cuisines;
      restaurant.openTime = openTime;
      restaurant.closeTime = closeTime;
      restaurant.daysOpenInWeek = daysOpenInWeek;
      restaurant.menuImage = menuImage.path;
      restaurant.costFor = costFor;
      restaurant.address = address;
      if (image) {
        deleteFile(restaurant.image);
        restaurant.image = image.path;
      }
      if (menuImage) {
        deleteFile(restaurant.menuImage);
        restaurant.menuImage = image.path;
      }
      await restaurant.save();
      return res.status(200).json({
        message: "Restaurant updated",
        id: Id,
        data: {
          ...restaurant._doc,
          image: noImage('uploads/restaurants/', restaurant.image),
          menuImage: noImage('uploads/restaurants/', restaurant.menuImage),
        }
      })
    } else {
      if (isRestaurantExist) {
        throw new Error("Restaurant already existed!");
      }
      const newRestro = new Restaurant({
        user: req.user.userId,
        name: name,
        mobile: mobile,
        landline: landline,
        image: image ? image.path : "",
        owener: owener,
        manager: manager,
        orderContact: orderContact,
        restaurantType: restaurantType,
        yearOfBirth: yearOfBirth,
        establistmentType: establistmentType,
        cuisines: cuisines,
        openTime: openTime,
        closeTime: closeTime,
        daysOpenInWeek: daysOpenInWeek,
        menuImage: menuImage ? menuImage.path : "",
        costFor: costFor,
        address: address
      });
      await newRestro.save();
      return res.status(201).json({
        message: "Restaurants addedd successfully",
        data: {
          ...newRestro._doc,
          image: noImage('uploads/restaurants/', newRestro.image),
          menuImage: noImage('uploads/restaurants/', newRestro.menuImage)
        }
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
    const userId = req.user.userId;
    const restarantId = req.params.restarantId;
    const restaurant = await Restaurant.findById(restarantId);

    // if not 
    if (restaurant.user !== userId) {
      deleteFile(image.path)
      throw hasError("Restaurant not found", 400, next);
    }

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
      restaurant.image = image.path;
    }
    await restaurant.save();
    return res.status(200).json({
      message: "Restaurant hero image updated successfully",
      id: restarantId,
      data: {
        ...restaurant._doc,
        image: noImage('uploads/restaurants/', restaurant.image),
        menuImage: noImage('uploads/restaurants/', restaurant.menuImage)
      }
    });
  }
  catch (err) {
    deleteFile(req.file.path);
    next(err)
  }
}


/**
 * Activate restaurant
 */
exports.openRestaurant = async function (req, res, next) {
  try {
    await isVendor(req.user.userId);
    const restarantId = req.params.restarantId;
    const restaurant = await Restaurant.findById(restarantId);
    console.log('restarantId', restarantId, restaurant)
    if (!restaurant) {
      throw new Error("Restaurant not found");
    }
    restaurant.isOpen = true;
    restaurant.isClose = false;
    await restaurant.save();
    return res.status(200).json({
      message: "Restaurant deactivated successfully!",
      id: restarantId,
      data: {
        ...restaurant._doc,
        image: noImage('uploads/restaurants/', restaurant.image),
        menuImage: noImage('uploads/restaurants/', restaurant.menuImage)
      }
    })

  } catch (err) {
    next(err)
  }
}
/**
 * Deactivate Restaurant
 */
exports.closeRestaurant = async function (req, res, next) {
  try {
    await isVendor(req.user.userId);
    const restarantId = req.params.restarantId;
    const restaurant = await Restaurant.findById(restarantId);
    if (!restaurant) {
      throw new Error("Restaurant not found");
    }
    restaurant.isClose = true;
    restaurant.isOpen = false;
    await restaurant.save();
    return res.status(200).json({
      message: "Restaurant activated successfully!",
      id: restarantId,
      data: {
        ...restaurant._doc,
        image: noImage('uploads/restaurants/', restaurant.image),
        menuImage: noImage('uploads/restaurants/', restaurant.menuImage)
      }
    })

  } catch (err) {
    next(err)
  }
}



/**
 * Activate restaurant
 */
exports.deactivateRestaurant = async function (req, res, next) {
  try {
    await isAdmin(req.user.userId);
    const restarantId = req.params.restarantId;
    const restaurant = await Restaurant.findById(restarantId);
    console.log('restarantId', restarantId, restaurant)
    if (!restaurant) {
      throw new Error("Restaurant not found");
    }

    restaurant.active = false;
    await restaurant.save();
    return res.status(200).json({
      message: "Restaurant deactivated successfully!",
      id: restarantId,
      data: {
        ...restaurant._doc,
        image: noImage('uploads/restaurants/', restaurant.image),
        menuImage: noImage('uploads/restaurants/', restaurant.menuImage)
      }
    })

  } catch (err) {
    next(err)
  }
}
/**
 * Deactivate Restaurant
 */
exports.activateRestaurant = async function (req, res, next) {
  try {
    await isAdmin(req.user.userId);
    const restarantId = req.params.restarantId;
    const restaurant = await Restaurant.findById(restarantId);
    if (!restaurant) {
      throw new Error("Restaurant not found");
    }

    restaurant.active = true;
    await restaurant.save();
    return res.status(200).json({
      message: "Restaurant activated successfully!",
      id: restarantId,
      data: {
        ...restaurant._doc,
        image: noImage('uploads/restaurants/', restaurant.image),
        menuImage: noImage('uploads/restaurants/', restaurant.menuImage)
      }
    })

  } catch (err) {
    next(err)
  }
}