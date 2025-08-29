const { Proceso } = require('../models/proceso');
const { KPI } = require('../models/kpi');

exports.crear = async (req, res) => {
  try {
    const { nombre, fecha_inicio, estado } = req.body;
    if (!nombre || !fecha_inicio) {
      return res.status(400).json({ error: 'nombre y fecha_inicio son obligatorios' });
    }
    const p = await Proceso.create(req.body);
    res.status(201).json(p);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error al crear proceso' });
  }
};

exports.listar = async (_req, res) => {
  try {
    const ps = await Proceso.findAll({ include: KPI });
    res.json(ps);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error al listar procesos' });
  }
};

exports.ver = async (req, res) => {
  try {
    const p = await Proceso.findByPk(req.params.id, { include: KPI });
    if (!p) return res.status(404).json({ error: 'Proceso no encontrado' });
    res.json(p);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error al obtener proceso' });
  }
};

exports.actualizar = async (req, res) => {
  try {
    const p = await Proceso.findByPk(req.params.id);
    if (!p) return res.status(404).json({ error: 'Proceso no encontrado' });
    await p.update(req.body);
    res.json(p);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error al actualizar proceso' });
  }
};

exports.eliminar = async (req, res) => {
  try {
    const p = await Proceso.findByPk(req.params.id);
    if (!p) return res.status(404).json({ error: 'Proceso no encontrado' });
    await p.destroy();
    res.status(204).send();
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error al eliminar proceso' });
  }
};
