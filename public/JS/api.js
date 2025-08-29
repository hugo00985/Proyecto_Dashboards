const API = {
  procesos: {
    crear: (data) => fetch('/api/procesos', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data)}).then(r=>r.json()),
    listar: () => fetch('/api/procesos').then(r=>r.json()),
    ver: (id) => fetch(`/api/procesos/${id}`).then(r=>r.json()),
    actualizar: (id, data) => fetch(`/api/procesos/${id}`, { method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data)}).then(r=>r.json()),
    eliminar: (id) => fetch(`/api/procesos/${id}`, { method:'DELETE' })
  },
  kpis: {
    crear: (data) => fetch('/api/kpis', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data)}).then(r=>r.json()),
    listar: (id_proceso) => {
      const q = id_proceso ? `?id_proceso=${id_proceso}` : '';
      return fetch(`/api/kpis${q}`).then(r=>r.json());
    },
    ver: (id) => fetch(`/api/kpis/${id}`).then(r=>r.json()),
    actualizar: (id, data) => fetch(`/api/kpis/${id}`, { method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data)}).then(r=>r.json()),
    eliminar: (id) => fetch(`/api/kpis/${id}`, { method:'DELETE' })
  },
  analisis: {
    evolucion: (kpi, desde, hasta) =>
      fetch(`/api/analisis/evolucion?kpi=${encodeURIComponent(kpi)}&desde=${desde}&hasta=${hasta}`).then(r=>r.json())
  }
};
