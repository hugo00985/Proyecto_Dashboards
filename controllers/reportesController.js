const sequelize = require('../database');

exports.reporteVentas = async (req, res) => {
  try {
    const [resultados] = await sequelize.query(`
      SELECT 
        strftime('%Y-%m-%d', fecha) AS fecha,
        SUM(total) AS ventas_totales,
        COUNT(id) AS ordenes
      FROM Venta
      GROUP BY fecha
      ORDER BY fecha ASC
    `);

    res.json(resultados);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al generar reporte' });
  }
};
