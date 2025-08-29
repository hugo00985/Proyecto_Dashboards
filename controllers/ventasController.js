const { Venta } = require('../models/venta');

// GET /api/ventas/:id
exports.obtenerVentaPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const venta = await Venta.findByPk(id);
    if (!venta) {
      return res.status(404).json({ error: 'Venta no encontrada' });
    }
    res.json(venta);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la venta' });
  }
};

// DELETE /api/ventas/:id
exports.eliminarVenta = async (req, res) => {
  const { id } = req.params;
  try {
    const venta = await Venta.findByPk(id);
    if (!venta) {
      return res.status(404).json({ error: 'Venta no encontrada' });
    }
    await venta.destroy();
    res.json({ mensaje: 'Venta eliminada' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la venta' });
  }
};

// PUT /api/ventas/:id
exports.actualizarVenta = async (req, res) => {
  const { id } = req.params;
  const { fecha, total } = req.body;
  try {
    const venta = await Venta.findByPk(id);
    if (!venta) {
      return res.status(404).json({ error: 'Venta no encontrada' });
    }

    if (fecha) venta.fecha = new Date(fecha);
    if (total) venta.total = parseFloat(total);
    
    await venta.save();
    res.json({ mensaje: 'Venta actualizada', venta });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la venta' });
  }
};
