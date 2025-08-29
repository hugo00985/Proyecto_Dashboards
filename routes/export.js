const express = require('express');
const { ventasCSV, ventasExcel } = require('../controllers/exportController');
const router = express.Router();

router.get('/ventas/csv', ventasCSV);
router.get('/ventas/excel', ventasExcel);

module.exports = router;
