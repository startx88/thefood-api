exports.prodConfig = {
    db: `mongodb://${process.env.USERNAME}:${process.env.PASSWORD}@ds143734.mlab.com:43734/${process.env.DATABASE}`,
    secret_key: process.env.SECRET_KEY
}

