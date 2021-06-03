const Menu = require('../model/menu');
const Restaurant = require('../model/restaurant');
const { hasError, validationError } = require('../middleware/validation');
const { noImage, deleteFile, hasNoImage } = require('../utils');
const { isVendor } = require('../middleware/vendor')
const { isAdmin } = require('../middleware/admin')


/**
 * Get menu by restaurants
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.getMenuByRestaurant = async function (req, res, next) {
  try {
    const restarantId = req.params.restarantId;
    const menu = await Menu.find({ restaurant: restarantId });
    // error if not found
    if (!menu) {
      throw new Error("Menu not found for this restaurant!");
    }

    return res.status(200).send(menu)
  } catch (err) { next(err) }
}

/**
 * Get menu by restaurants
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.addUpdateMenu = async function (req, res, next) {
  try {
    validationError(req, next);
    await isVendor(req.user.userId, next);
    const restarantId = req.params.restarantId;
    const menuId = req.params.menuId;
    const menu = await Menu.findOne({ _id: menuId, restaurant: restarantId });

    // body
    const { title, price, offer } = req.body;
    const slug = title.replace(/\s+/, '-');
    if (menu) {
      menu.title = title;
      menu.slug = slug;
      menu.price = price;
      menu.offer = offer;
      menu.insertAt = Date.now()
      await menu.save();
      return res.status(200).send(menu)
    } else {
      const isMenu = await Menu.findOne({ slug: slug });
      if (isMenu) {
        throw new Error("Menu already existed!");
      }
      const newMenu = new Menu({
        restaurant: restarantId,
        title,
        slug,
        price,
        offer
      })
      await newMenu.save();
      return res.status(201).send(menu)
    }
  } catch (err) { next(err) }
}


/**
 * Get menu by restaurants
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.deleteMenu = async function (req, res, next) {
  try {
    await isVendor(req.user.userId, next);
    const restaurantId = req.params.restaurantId;
    const menuId = req.params.menuId;
    const menu = await Menu.findOne({ _id: menuId, restaurant: restaurantId });

    if (!menu) {
      const error = new Error("No menu found");
      error.statusCode = 404;
      throw next(error)
    }
    await menu.remove();
    return res.status(200).send(menu)
  } catch (err) { next(err) }
}