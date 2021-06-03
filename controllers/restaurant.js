const Restaurant = require('../model/restaurant');
const { hasError, validationError } = require('../middleware/validation');
const { noImage, deleteFile } = require('../utils');
const { isVendor } = require('../middleware/vendor')

// get all restaurant
exports.getAllRestaurants = async function (req, res, next) {
  try {
    const filters = req.query;
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
    });

    for (let i in filterdData) {
      filterdData[i].image = noImage('uploads/restaurants/', filterdData[i].image);
      filterdData[i].menuImage = noImage('uploads/restaurants/', filterdData[i].menuImage);
    }
    return res.status(200).send(filterdData)
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
    restaurant.image = noImage('uploads/restaurants/', restaurant.image)
    restaurant.menuImage = noImage('uploads/restaurants/', restaurant.menuImage)
    return res.status(200).send(restaurant)
  } catch (err) { next(err) }
}

// get restaurant
exports.getMyRestaurant = async function (req, res, next) {
  try {
    await isVendor(req.user.userId, next);
    const userId = req.user.userId;
    const restaurant = await Restaurant.findOne({ user: userId });
    if (!restaurant) {
      throw hasError("No restaurant found", 404, next);
    }
    restaurant.image = noImage('uploads/restaurants/', restaurant.image)
    restaurant.menuImage = noImage('uploads/restaurants/', restaurant.menuImage)
    return res.status(200).send(restaurant)
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
      email,
      mobile,
      website,
      landline,
      description,
      owner,
      manager,
      restaurantType,
      yearOfBirth,
      servingType,
      cuisines,
      daysOpenInWeek,
      timings,
      openNow,
      costForTwo,
      isClosed,
      address,
      isOpen,
      isClose
    } = req.body;
    const image = req.file;
    const restaurant = await Restaurant.findById(Id);
    const isRestaurantExist = await Restaurant.findOne({ user: req.user.userId });

    if (restaurant) {
      restaurant.name = name;
      restaurant.email = email;
      restaurant.mobile = mobile;
      restaurant.website = website;
      restaurant.landline = landline;
      restaurant.description = description;
      restaurant.owner = JSON.parse(owner);
      restaurant.manager = JSON.parse(manager);
      restaurant.restaurantType = restaurantType;
      restaurant.yearOfBirth = new Date(yearOfBirth);
      restaurant.servingType = servingType;
      restaurant.cuisines = JSON.parse(cuisines);
      restaurant.daysOpenInWeek = JSON.parse(daysOpenInWeek);
      restaurant.timings = JSON.parse(timings);
      restaurant.openNow = Boolean(openNow);
      restaurant.costForTwo = +costForTwo;
      restaurant.isClosed = Boolean(JSON.parse(isClosed));
      restaurant.address = JSON.parse(address);
      restaurant.insertAt = Date.now();

      if (image) {
        deleteFile(restaurant.image);
        restaurant.image = image.path;
      }
      await restaurant.save();
      restaurant.image = noImage('uploads/restaurants/', restaurant.image)
      restaurant.menuImage = noImage('uploads/restaurants/', restaurant.menuImage)
      return res.status(200).send(restaurant)
    } else {
      if (isRestaurantExist) {
        deleteFile(image.path);
        throw new Error("Restaurant already existed!");
      }
      const newRestro = new Restaurant({
        user: req.user.userId,
        name: name,
        email: email,
        mobile: mobile,
        website: website,
        landline: landline,
        description: description,
        image: image ? image.path : "",
        owner: JSON.parse(owner),
        manager: JSON.parse(manager),
        restaurantType: restaurantType,
        yearOfBirth: new Date(yearOfBirth),
        servingType: servingType,
        cuisines: JSON.parse(cuisines),
        daysOpenInWeek: JSON.parse(daysOpenInWeek),
        timings: JSON.parse(timings),
        openNow: !!JSON.parse(openNow),
        isClosed: !!JSON.parse(isClosed),
        costForTwo: +costForTwo,
        address: JSON.parse(address)
      });
      await newRestro.save();
      newRestro.image = noImage('uploads/restaurants/', newRestro.image);
      newRestro.menuImage = noImage('uploads/restaurants/', newRestro.menuImage);
      return res.status(201).send(newRestro)
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
    restaurant.image = noImage('uploads/restaurants/', restaurant.image);
    restaurant.menuImage = noImage('uploads/restaurants/', restaurant.menuImage);
    return res.status(200).send(restaurant)
  }
  catch (err) {
    deleteFile(req.file.path);
    next(err)
  }
}


/**
 * Activate restaurant
 */
exports.openCloseRestaurant = async function (req, res, next) {
  try {
    await isVendor(req.user.userId);
    const restarantId = req.params.restarantId;
    const restaurant = await Restaurant.findById(restarantId);
    if (!restaurant) {
      throw new Error("Restaurant not found");
    }
    restaurant.isClosed = !restaurant.isClosed;
    await restaurant.save();
    restaurant.image = noImage('uploads/restaurants/', restaurant.image);
    restaurant.menuImage = noImage('uploads/restaurants/', restaurant.menuImage);
    return res.status(200).send(restaurant)
  } catch (err) {
    next(err)
  }
}


/**
 * Activate restaurant
 */
exports.activeDeactiveRestaurant = async function (req, res, next) {
  try {
    const restarantId = req.params.restarantId;
    const restaurant = await Restaurant.findById(restarantId);
    if (!restaurant) {
      throw new Error("Restaurant not found");
    }
    restaurant.active = !restaurant.active;
    await restaurant.save();
    restaurant.image = noImage('uploads/restaurants/', restaurant.image);
    restaurant.menuImage = noImage('uploads/restaurants/', restaurant.menuImage);
    return res.status(200).send(restaurant)
  } catch (err) {
    next(err)
  }
}
