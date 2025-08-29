const express = require('express');
const router = express.Router();
const { obtenerVentaPorId, eliminarVenta, actualizarVenta } = require('../controllers/ventasController');

router.get('/:id', obtenerVentaPorId);
router.delete('/:id', eliminarVenta);
router.put('/:id', actualizarVenta);

module.exports = router;
