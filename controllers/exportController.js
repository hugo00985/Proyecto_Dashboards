const sequelize = require('../database');
const { QueryTypes } = require('sequelize');
const ExcelJS = require('exceljs');

exports.ventasCSV = async (req, res) => {
  try {
    const { desde, hasta } = req.query;
    if (!desde || !hasta) return res.status(400).send('Parámetros desde y hasta requeridos');

    const rows = await sequelize.query(
      `SELECT strftime('%Y-%m-%d', fecha) AS fecha, SUM(total) AS valor
       FROM Venta
       WHERE date(fecha) BETWEEN date(:desde) AND date(:hasta)
       GROUP BY strftime('%Y-%m-%d', fecha)
       ORDER BY fecha ASC`,
      { type: QueryTypes.SELECT, replacements: { desde, hasta } }
    );

    const header = 'fecha,valor\n';
    const body = rows.map(r => `${r.fecha},${r.valor}`).join('\n');
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="ventas_${desde}_a_${hasta}.csv"`);
    res.send(header + body);
  } catch (e) {
    console.error(e);
    res.status(500).send('Error generando CSV');
  }
};

exports.ventasExcel = async (req, res) => {
  try {
    const { desde, hasta } = req.query;
    if (!desde || !hasta) return res.status(400).send('Parámetros desde y hasta requeridos');

    const rows = await sequelize.query(
      `SELECT strftime('%Y-%m-%d', fecha) AS fecha, SUM(total) AS valor
       FROM Venta
       WHERE date(fecha) BETWEEN date(:desde) AND date(:hasta)
       GROUP BY strftime('%Y-%m-%d', fecha)
       ORDER BY fecha ASC`,
      { type: QueryTypes.SELECT, replacements: { desde, hasta } }
    );

    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('Evolución ventas');
    ws.columns = [
      { header: 'Fecha', key: 'fecha', width: 15 },
      { header: 'Valor', key: 'valor', width: 12 },
    ];
    ws.addRows(rows);
    ws.getRow(1).font = { bold: true };

    res.setHeader('Content-Type','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="ventas_${desde}_a_${hasta}.xlsx"`);
    await wb.xlsx.write(res);
    res.end();
  } catch (e) {
    console.error(e);
    res.status(500).send('Error generando Excel');
  }
};
