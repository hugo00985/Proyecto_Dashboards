const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Venta = sequelize.define('Venta', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  fecha: {
    type: DataTypes.DATE,
    allowNull: false
  },
  total: {
    type: DataTypes.FLOAT,
    allowNull: false
  }
});

module.exports = { Venta };
