const express = require('express');
const path = require('path');
const cors = require('cors');
const sequelize = require('./database');

// Importar rutas
const metricasRoutes = require('./routes/metricas');
const ventasRoutes = require('./routes/ventas');
const dashboardRoutes = require('./routes/dashboard');
const procesosRoutes = require('./routes/procesos');
const kpisRoutes = require('./routes/kpis');
const analisisRoutes = require('./routes/analisis');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Montar rutas
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/ventas', ventasRoutes);
app.use('/api/metricas', metricasRoutes);
app.use('/api/procesos', procesosRoutes);
app.use('/api/kpis', kpisRoutes);
app.use('/api/analisis', analisisRoutes);
app.use('/api/export', require('./routes/export'));

// Sincronizar BD y levantar servidor
sequelize.sync().then(async () => {
  console.log('Base de datos sincronizada');

  // Opcional: datos de prueba
  const { Venta } = require('./models/venta');
  if (await Venta.count() === 0) {
    await Venta.bulkCreate([
      { fecha: '2025-08-01', total: 120 },
      { fecha: '2025-08-02', total: 250 },
      { fecha: '2025-08-03', total: 320 },
      { fecha: '2025-08-07', total: 80 }
    ]);
    console.log('Datos de prueba insertados en Venta');
  }

  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('Error al sincronizar BD:', err);
});
