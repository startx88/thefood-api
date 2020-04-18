exports.tryCatch = (cb, next) => {
    try {
        cb();
    } catch (error) {
        next(error)
    }
}