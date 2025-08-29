const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Proceso = sequelize.define('Proceso', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING(120), allowNull: false },
  descripcion: { type: DataTypes.TEXT },
  responsable: { type: DataTypes.STRING(120) },
  fecha_inicio: { type: DataTypes.DATE, allowNull: false },
  fecha_fin: { type: DataTypes.DATE },
  estado: { type: DataTypes.STRING(50), allowNull: false, defaultValue: 'activo' }
}, {
  tableName: 'Proceso',
  timestamps: false
});

module.exports = { Proceso };
