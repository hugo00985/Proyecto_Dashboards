const express = require('express');
const { evolucion } = require('../controllers/analisisController');
const router = express.Router();

router.get('/evolucion', evolucion);

module.exports = router;
 