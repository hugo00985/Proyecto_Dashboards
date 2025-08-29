const { KPI } = require('../models/kpi');

exports.crear = async (req, res) => {
  try {
    const { nombre, id_proceso } = req.body;
    if (!nombre || !id_proceso) {
      return res.status(400).json({ error: 'nombre e id_proceso son obligatorios' });
    }
    const k = await KPI.create(req.body);
    res.status(201).json(k);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error al crear KPI' });
  }
};

exports.listar = async (req, res) => {
  try {
    const where = {};
    if (req.query.id_proceso) where.id_proceso = req.query.id_proceso;
    const ks = await KPI.findAll({ where });
    res.json(ks);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error al listar KPIs' });
  }
};

exports.ver = async (req, res) => {
  try {
    const k = await KPI.findByPk(req.params.id);
    if (!k) return res.status(404).json({ error: 'KPI no encontrado' });
    res.json(k);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error al obtener KPI' });
  }
};

exports.actualizar = async (req, res) => {
  try {
    const k = await KPI.findByPk(req.params.id);
    if (!k) return res.status(404).json({ error: 'KPI no encontrado' });
    await k.update(req.body);
    res.json(k);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error al actualizar KPI' });
  }
};

exports.eliminar = async (req, res) => {
  try {
    const k = await KPI.findByPk(req.params.id);
    if (!k) return res.status(404).json({ error: 'KPI no encontrado' });
    await k.destroy();
    res.status(204).send();
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error al eliminar KPI' });
  }
};
