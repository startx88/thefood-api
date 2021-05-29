const path = require("path");
const { filterFiles, deleteFile } = require('./file')
const { tryCatch } = require('./tryCatch');
/**
 * Regular expressions
 */
const regExp = {
  docReg: /\.(doc|docx|pdf)$/g,
  xlsReg: /\.(xls|xlsx)$/g,
  imgReg: /\.(jpe?g|png|gif|jfif|pmp|webp)$/ig,
  password: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,16}$/,
  mobile: /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
  email: /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
};
/**
 * Get time
 * @param {*} time 
 * @returns 
 */
const getTime = (time) => {
  const date = new Date();
  date.setHours(date.getHours() + time);
  return date;
}


/**
 * No image
 * @param {*} folder 
 * @param {*} path 
 * @returns 
 */
const noImage = (folder, imagePath) => {
  return path ? 'http://localhost:5001/' + folder + path.basename(imagePath) : 'http://localhost:5001/images/noimage.jpg';
}


const hasNoImage = (image, next) => {
  if (!image) {
    deleteFile(image.path)
    const error = new Error("Please select image");
    error.statusCode = 400;
    throw next(error)
  }
}

const imageType = (image) => {
  if (image) {
    const error = new Error("Please upload file in these formats (JPG|JPEG|PNG|GIF|JIFF)");
    error.statusCode = 400;
    throw next(error)
  }
}

module.exports = {
  noImage,
  regExp,
  getTime,
  filterFiles,
  deleteFile,
  tryCatch,
  hasNoImage,
  imageType
}