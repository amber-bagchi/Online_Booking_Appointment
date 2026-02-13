const {Sequelize} = require("sequelize");

const sequelize = new Sequelize("mysqldb", "root", "Amber2604@", {
    host: "localhost",
    dialect: "mysql",
    logging: false
});

module.exports = sequelize;