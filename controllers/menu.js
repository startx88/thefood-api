const Menu = require('../model/menu');
const Restaurant = require('../model/restaurant');
const { isVendor } = require('../middleware/vendor')
const { hasError, validationError } = require('../middleware/validation');

/**
 * Get menu by restaurants
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.getMenuByRestro = async function (req, res, next) {
  try {
    await isVendor(req.user.userId, next);
    const user = req.user.userId;
    const restarantId = req.params.restarantId;
    const restaurant = await Restaurant.findOne({ user: user, _id: restarantId });
    const menu = await Menu.find({ restaurant: restarantId });
    // error if not found
    if (!menu) {
      throw new Error("Menu not found for this restaurant!");
    }

    return res.status(200).json({
      message: "Menu fetched for " + restaurant.name,
      data: menu
    })

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
    await isVendor(req.user.userId, next);
    validationError(req, next);
    const userId = req.user.userId;
    const restarantId = req.params.restarantId;
    const menuId = req.params.menuId;
    //const restaurant = await Restaurant.findOne({ user: user, _id: restarantId });
    const menu = await Menu.findOne({ _id: menuId, restaurant: restarantId });

    // body
    const { title } = req.body;
    const slug = title.replace(/\s+/, '-');
    if (menu) {
      menu.title = title;
      menu.slug = slug;
      menu.insertAt = Date.now()
      await menu.save();

      return res.status(200).json({
        message: "Menu updated successfully",
        menuId: menuId,
        data: menu
      })
    } else {
      const isMenu = await Menu.findOne({ slug: slug });
      if (isMenu) {
        throw new Error("Menu already existed!");
      }
      const newMenu = new Menu({
        restaurant: restarantId,
        title,
        slug
      })

      await newMenu.save();
      return res.status(201).json({
        message: "Menu created successfully",
        menuId: menuId,
        data: newMenu
      })
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
    return res.status(200).json({
      message: "Menu deleted successfully!",
      data: menu,
      menuId: menuId
    })
  } catch (err) { next(err) }
}