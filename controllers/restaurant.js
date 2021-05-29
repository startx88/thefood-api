const Restaurant = require('../model/restaurant');
const { hasError, validationError } = require('../middleware/validation');
const { noImage, deleteFile } = require('../utils');
const { isVendor } = require('../middleware/vendor')
const { isAdmin } = require('../middleware/admin')

// get all restaurant
exports.getAllRestaurants = async function (req, res, next) {
  try {
    const filters = req.query;
    const page = +req.query.page || 1;
    const limit = req.query.limit !== "undefined" ? +req.query.limit || 6 : 0;
    const total = await Restaurant.find().countDocuments();
    const Restaurants = await Restaurant
      .find()
      .sort({ title: 1 })
      .limit(limit)
      .skip((page - 1) * limit);

    const filterdData = Restaurants.filter((data) => {
      let isValid = true;
      for (key in filters) {
        isValid = isValid && data[key] == filters[key];
      }
      return isValid;
    })

    return res.status(200).json({
      message: "Restaurants fetched successfully",
      total: total,
      currentPage: page,
      totalPage: Math.ceil(total / limit),
      next: page + 1,
      prev: page - 1,
      hasNext: page * limit < total,
      hasPrev: page > 1,
      data: filterdData.map((item) => ({
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
      throw hasError("No restaurant found", 404, next);
    }
    return res.status(200).json({
      message: 'Restaurant data fetched!',
      id: restaurant.id,
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
      owner,
      manager,
      restaurantType,
      yearOfBirth,
      servingType,
      cuisines,
      openTime,
      closeTime,
      daysOpenInWeek,
      costFor,
      address,
      isOpen,
      isClose
    } = req.body;
    const image = req.file;
    const restaurant = await Restaurant.findById(Id);
    const isRestaurantExist = await Restaurant.findOne({ user: req.user.userId });

    if (restaurant) {
      restaurant.name = name;
      restaurant.mobile = mobile;
      restaurant.landline = landline;
      restaurant.owner = JSON.parse(owner);
      restaurant.manager = JSON.parse(manager);
      restaurant.restaurantType = restaurantType;
      restaurant.yearOfBirth = new Date(yearOfBirth);
      restaurant.servingType = servingType;
      restaurant.cuisines = JSON.parse(cuisines);
      restaurant.openTime = openTime;
      restaurant.closeTime = closeTime;
      restaurant.daysOpenInWeek = JSON.parse(daysOpenInWeek);
      restaurant.costFor = +costFor;
      restaurant.address = JSON.parse(address);
      restaurant.isOpen = Boolean(JSON.parse(isOpen));
      restaurant.isClose = Boolean(JSON.parse(isClose));
      if (image) {
        deleteFile(restaurant.image);
        restaurant.image = image.path;
      }

      await restaurant.save();
      return res.status(200).json({
        message: "Restaurant updated",
        id: Id,
        data: {
          ...restaurant._doc,
          image: noImage('uploads/restaurants/', restaurant.image),
        }
      })
    } else {
      if (isRestaurantExist) {
        deleteFile(image.path);
        throw new Error("Restaurant already existed!");
      }

      const newRestro = new Restaurant({
        user: req.user.userId,
        name: name,
        mobile: mobile,
        landline: landline,
        image: image ? image.path : "",
        owner: JSON.parse(owner),
        manager: JSON.parse(manager),
        isOpen: !!JSON.parse(isOpen),
        isClose: !!JSON.parse(isClose),
        restaurantType: restaurantType,
        yearOfBirth: new Date(yearOfBirth),
        servingType: servingType,
        cuisines: JSON.parse(cuisines),
        openTime: openTime,
        closeTime: closeTime,
        daysOpenInWeek: JSON.parse(daysOpenInWeek),
        costFor: +costFor,
        address: JSON.parse(address)
      });

      console.log(newRestro);
      await newRestro.save();
      return res.status(201).json({
        message: "Restaurants addedd successfully",
        data: {
          ...newRestro._doc,
          image: noImage('uploads/restaurants/', newRestro.image),
        }
      })
    }
  } catch (err) {
    deleteFile(req.file.path);
    next(err)
  }
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