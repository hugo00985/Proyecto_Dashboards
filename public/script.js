async function cargarReporte() {
  const res = await fetch('/api/metricas/reportes');
  const datos = await res.json();

  const fechas = datos.map(d => d.fecha);
  const ventas = datos.map(d => d.ventas_totales);

  // Crear gráfico con Chart.js
  new Chart(document.getElementById('graficoVentas'), {
    type: 'bar',
    data: {
      labels: fechas,
      datasets: [{
        label: 'Ventas por día',
        data: ventas,
        backgroundColor: 'rgba(54, 162, 235, 0.5)'
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });

  // Llenar tabla
  const tbody = document.querySelector('#tablaReporte tbody');
  datos.forEach(row => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${row.fecha}</td>
      <td>${row.ventas_totales}</td>
      <td>${row.ordenes}</td>
    `;
    tbody.appendChild(tr);
  });
}

cargarReporte();
