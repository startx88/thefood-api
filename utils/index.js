const { filterFiles, deleteFile } = require('./file')

const getTime = (time) => {
  const date = new Date();
  date.setHours(date.getHours() + time);
  return date;
}

const regExp = {
  docReg: /\.(doc|docx|pdf)$/g,
  xlsReg: /\.(xls|xlsx)$/g,
  imgReg: /\.(jpe?g|png|gif|jfif|pmp|webp)$/ig,
  password: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,16}$/,
  mobile: /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
  email: /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
};


const noImage = (folder, path) => {
  return path ? 'http://localhost:5000/' + folder + p.basename(path) : 'http://localhost:5000/images/noimage.jpg';
}

module.exports = {
  noImage,
  regExp,
  getTime,
  filterFiles,
  deleteFile
}