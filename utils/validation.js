const isnotImage = (image) => {
    if (!image) {
        const error = new Error("Please upload file in these formats (JPG|JPEG|PNG|GIF|JIFF)");
        error.statusCode = 400;
        throw next(error)
    }
}

module.exports = {
    isnotImage
}