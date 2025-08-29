// Tabs
document.querySelectorAll('.tab-btn').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
    document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.tab).classList.add('active');
  });
});
// activar primera
document.querySelector('.tab-btn').classList.add('active');

// ---------- PROCESOS ----------
const formProceso = document.getElementById('form-proceso');
const msgProceso  = document.getElementById('msg-proceso');
const tbodyProc   = document.querySelector('#tabla-procesos tbody');

formProceso.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const data = Object.fromEntries(new FormData(formProceso).entries());
  try {
    const res = await API.procesos.crear(data);
    if(res.error){ msgProceso.textContent = res.error; return; }
    msgProceso.textContent = `Creado ID ${res.id}`;
    formProceso.reset();
    cargarProcesos();
  } catch(err){ msgProceso.textContent = 'Error al crear'; }
});

async function cargarProcesos(){
  const procesos = await API.procesos.listar();
  tbodyProc.innerHTML = '';
  procesos.forEach(p=>{
    const tr = document.createElement('tr');
    const badge = `<span class="badge ${p.estado==='activo'?'ok':p.estado==='pausado'?'warn':'danger'}">${p.estado}</span>`;
    tr.innerHTML = `
      <td>${p.id}</td>
      <td>${p.nombre}</td>
      <td>${p.responsable??'-'}</td>
      <td>${badge}</td>
      <td>${(p.fecha_inicio||'').toString().slice(0,10)}</td>
      <td>${(p.fecha_fin||'').toString().slice(0,10)}</td>
      <td class="actions">
        <button data-edit="${p.id}">Editar</button>
        <button data-del="${p.id}" class="secondary">Eliminar</button>
      </td>
    `;
    tbodyProc.appendChild(tr);
  });
}
tbodyProc.addEventListener('click', async (e)=>{
  const idDel = e.target.dataset.del;
  const idEdt = e.target.dataset.edit;
  if(idDel){
    await API.procesos.eliminar(idDel);
    cargarProcesos();
  } else if(idEdt){
    const nuevoEstado = prompt('Nuevo estado: activo | pausado | finalizado', 'activo');
    if(nuevoEstado) { await API.procesos.actualizar(idEdt, { estado:nuevoEstado }); cargarProcesos(); }
  }
});
cargarProcesos();

// ---------- KPIS ----------
const formKpi = document.getElementById('form-kpi');
const msgKpi  = document.getElementById('msg-kpi');
const tbodyK  = document.querySelector('#tabla-kpis tbody');
const filtroK = document.getElementById('filtro-kpi-proceso');

document.getElementById('btn-filtrar-kpis').addEventListener('click', (e)=>{
  e.preventDefault();
  cargarKpis(filtroK.value || null);
});
document.getElementById('btn-limpiar-kpis').addEventListener('click', (e)=>{
  e.preventDefault(); filtroK.value=''; cargarKpis();
});

formKpi.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const data = Object.fromEntries(new FormData(formKpi).entries());
  data.valor_actual = parseFloat(data.valor_actual||0);
  if(data.umbral_min) data.umbral_min = parseFloat(data.umbral_min);
  if(data.umbral_max) data.umbral_max = parseFloat(data.umbral_max);
  try{
    const res = await API.kpis.crear(data);
    if(res.error){ msgKpi.textContent = res.error; return; }
    msgKpi.textContent = `KPI creado ID ${res.id}`;
    formKpi.reset();
    cargarKpis();
  }catch(err){ msgKpi.textContent = 'Error al crear KPI'; }
});

async function cargarKpis(idProceso=null){
  const kpis = await API.kpis.listar(idProceso);
  tbodyK.innerHTML = '';
  kpis.forEach(k=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${k.id}</td>
      <td>${k.nombre}</td>
      <td>${k.id_proceso ?? '-'}</td>
      <td>${k.valor_actual}</td>
      <td>${k.umbral_min ?? '-'}</td>
      <td>${k.umbral_max ?? '-'}</td>
      <td class="actions">
        <button data-editk="${k.id}">+10</button>
        <button data-delk="${k.id}" class="secondary">Eliminar</button>
      </td>
    `;
    tbodyK.appendChild(tr);
  });
}
tbodyK.addEventListener('click', async (e)=>{
  const idDel = e.target.dataset.delk;
  const idEdt = e.target.dataset.editk;
  if(idDel){
    await API.kpis.eliminar(idDel);
    cargarKpis(filtroK.value || null);
  }else if(idEdt){
    // demo: sumar 10 al valor_actual
    const kpi = await API.kpis.ver(idEdt);
    const nuevo = (kpi.valor_actual || 0) + 10;
    await API.kpis.actualizar(idEdt, { valor_actual: nuevo });
    cargarKpis(filtroK.value || null);
  }
});
cargarKpis();

// ---------- ANALISIS ----------
const formAnalisis = document.getElementById('form-analisis');
const msgAnalisis  = document.getElementById('msg-analisis');
const tbodyEvo     = document.querySelector('#tabla-evolucion tbody');
const ctxChart     = document.getElementById('chart-evolucion');

let chart;

formAnalisis.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const f = Object.fromEntries(new FormData(formAnalisis).entries());
  try{
    const data = await API.analisis.evolucion(f.kpi, f.desde, f.hasta);
    renderEvolucion(data);
    msgAnalisis.textContent = `Mostrando ${data.puntos?.length||0} puntos`;
  }catch(err){
    msgAnalisis.textContent = 'Error generando análisis';
  }
});

function renderEvolucion({ puntos=[] }){
  const labels = puntos.map(p=>p.fecha);
  const valores = puntos.map(p=>p.valor);
  // tabla
  tbodyEvo.innerHTML = puntos.map(p=>`<tr><td>${p.fecha}</td><td>${p.valor}</td></tr>`).join('');
  // chart
  if(chart) chart.destroy();
  chart = new Chart(ctxChart, {
    type: 'line',
    data: { labels, datasets: [{ label:'Evolución', data: valores }]},
    options: { responsive:true, maintainAspectRatio:false }
  });
}

// Prefill fechas: últimos 7 días
(function presetFechas(){
  const hoy = new Date();
  const hace7 = new Date(hoy); hace7.setDate(hoy.getDate()-6);
  const fmt = d => d.toISOString().slice(0,10);
  formAnalisis.desde.value = fmt(hace7);
  formAnalisis.hasta.value = fmt(hoy);
}
)();

// Exportar CSV/Excel usando los campos actuales del formulario
document.getElementById('btn-export-csv').addEventListener('click', ()=>{
  const { desde, hasta } = formAnalisis;
  const url = `/api/export/ventas/csv?desde=${desde.value}&hasta=${hasta.value}`;
  window.open(url, '_blank');
});
document.getElementById('btn-export-excel').addEventListener('click', ()=>{
  const { desde, hasta } = formAnalisis;
  const url = `/api/export/ventas/excel?desde=${desde.value}&hasta=${hasta.value}`;
  window.open(url, '_blank');
});
