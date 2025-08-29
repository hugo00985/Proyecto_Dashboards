const sequelize = require('../database');
const { QueryTypes } = require('sequelize');

/**
 * GET /api/analisis/evolucion?kpi=ventas_totales&desde=2025-08-01&hasta=2025-08-31
 * Nota: Usa la tabla Venta ya existente para una serie temporal simple.
 */
exports.evolucion = async (req, res) => {
  try {
    const { kpi = 'ventas_totales', desde, hasta } = req.query;
    if (!desde || !hasta) {
      return res.status(400).json({ error: 'Parámetros desde y hasta son obligatorios (YYYY-MM-DD)' });
    }

    const rows = await sequelize.query(
      `
      SELECT strftime('%Y-%m-%d', fecha) AS fecha, SUM(total) AS valor
      FROM Venta
      WHERE date(fecha) BETWEEN date(:desde) AND date(:hasta)
      GROUP BY strftime('%Y-%m-%d', fecha)
      ORDER BY fecha ASC
      `,
      { type: QueryTypes.SELECT, replacements: { desde, hasta } }
    );

    res.json({ kpi, desde, hasta, puntos: rows });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error al generar análisis' });
  }
};
