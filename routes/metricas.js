const express = require('express');
const router = express.Router();
const { obtenerMetricas, registrarVenta } = require('../controllers/metricasController');



router.get('/', obtenerMetricas);
router.post('/', registrarVenta); 
router.get('/reportes', require('../controllers/reportesController').reporteVentas);


module.exports = router;
