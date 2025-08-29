const express = require('express');
const c = require('../controllers/procesosController');
const router = express.Router();

router.post('/', c.crear);
router.get('/', c.listar);
router.get('/:id', c.ver);
router.put('/:id', c.actualizar);
router.delete('/:id', c.eliminar);

module.exports = router;
