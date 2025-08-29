const { Venta } = require('../models/venta');
const { Op } = require('sequelize');

exports.obtenerMetricas = async (req, res) => {
  const { fecha_inicio, fecha_fin } = req.query;

  try {
    const where = {};
    if (fecha_inicio && fecha_fin) {
      where.fecha = {
        [Op.between]: [new Date(fecha_inicio), new Date(fecha_fin)]
      };
    }

    const ventas = await Venta.findAll({ where });

    const total = ventas.reduce((acc, venta) => acc + venta.total, 0);
    const ordenes = ventas.length;

    res.json({
      ventas_totales: total,
      ordenes: ordenes,
      productos_destacados: [] // Esto se implementará más adelante
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener métricas' });
  }
};

exports.registrarVenta = async (req, res) => {
  const { fecha, total } = req.body;

  if (!fecha || !total) {
    return res.status(400).json({ error: 'Fecha y total son obligatorios.' });
  }

  try {
    const nuevaVenta = await Venta.create({
      fecha: new Date(fecha),
      total: parseFloat(total)
    });

    res.status(201).json({
      mensaje: 'Venta registrada exitosamente',
      venta: nuevaVenta
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al registrar la venta' });
  }
};

