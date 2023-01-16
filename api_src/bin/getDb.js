const { Sequelize } = require('sequelize');

module.exports = new Sequelize(`mariadb://${process.env.MARIADB_USER}:${process.env.MARIADB_PASSWORD}@bdd/${process.env.MARIADB_DATABASE}`)