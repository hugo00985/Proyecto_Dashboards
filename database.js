const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'dashboard.db' 
});

module.exports = sequelize;
