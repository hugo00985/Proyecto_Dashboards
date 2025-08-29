exports.obtenerDashboard = (req, res) => {
  // Simulación: dashboard predefinido
  res.json({
    usuario: "admin",
    widgets: [
      { tipo: "grafico_lineas", metrica: "ventas_totales" },
      { tipo: "grafico_pastel", metrica: "productos_mas_vendidos" }
    ]
  });
};
