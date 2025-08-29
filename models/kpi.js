const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const { Proceso } = require('./proceso');

const KPI = sequelize.define('KPI', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING(120), allowNull: false },
  descripcion: { type: DataTypes.TEXT },
  valor_actual: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
  umbral_min: { type: DataTypes.FLOAT },
  umbral_max: { type: DataTypes.FLOAT }
}, {
  tableName: 'KPI',
  timestamps: false
});

// relaciones
Proceso.hasMany(KPI, { foreignKey: 'id_proceso', onDelete: 'CASCADE' });
KPI.belongsTo(Proceso, { foreignKey: 'id_proceso' });

module.exports = { KPI };
