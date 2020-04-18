const fs = require('fs')
const filterFiles = (req, file, cb) => {
    if (!file.originalname.match(/\.(jpe?g|png|gif|jfif)$/g)) {
        cb(new Error("Please upload file in these formats (JPG|JPEG|PNG|GIF|JFIF)"))
    }
    cb(null, true)
}


const deleteFile = (path) => {
    if (fs.existsSync(path)) {
        fs.unlinkSync(path, err => {
            if (err) console.log('err')
        })
    }
}



module.exports = {
    filterFiles,
    deleteFile
}

