const { devConfig } = require('./dev');
const { prodConfig } = require('./prod')


let globalConfig = {

}

const NODE_ENV = process.env.NODE_ENV || "development";

switch (NODE_ENV) {
    case "development":
        globalConfig = {
            ...globalConfig,
            ...devConfig
        }
        break;
    case "production":
        globalConfig = {
            ...globalConfig,
            ...prodConfig
        }
    default:
        globalConfig;
        break;
}

module.exports = globalConfig