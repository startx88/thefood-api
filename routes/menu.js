const route = require('express').Router();
const { addUpdateMenu, deleteMenu, getMenuByRestro } = require('../controllers/menu')
const { body } = require('express-validator');
const { auth } = require('../middleware/auth')


/**
 * URL        :       http://localhost:5000/api/menu
 */
route.get('/:restarantId', auth, getMenuByRestro);


/**
 * URL        :       http://localhost:5000/api/menu
 */
route.post('/:restarantId/:menuId?', [
  body("title", "title is required!").notEmpty()
], auth, addUpdateMenu);


/**
 * URL        :       http://localhost:5000/api/menu
 */
route.delete('/:restarantId/:menuId', auth, deleteMenu);

/**
 * Export menu route
 */
module.exports = route;
