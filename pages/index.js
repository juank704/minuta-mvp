import { useState, useEffect } from 'react';
import { TablaMinutas } from '../components/TablaMinutas';
import { TablaMinutasConAcciones } from '../components/TablaMinutasConAcciones';


export default function Home() {
  const [q, setQ] = useState('');
  const [resultados, setResultados] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [contenido, setContenido] = useState('');
  const [todas, setTodas] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [modoEdicion, setModoEdicion] = useState(false);
  const [idEditando, setIdEditando] = useState(null);
  const [asistentes, setAsistentes] = useState('');
  const [tags, setTags] = useState('');
  const [proyecto, setProyecto] = useState('');
  const [boletin, setBoletin] = useState('');
  const [comision, setComision] = useState('');
  const [tipoEvento, setTipoEvento] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFin, setHoraFin] = useState('');
  const [urgencia, setUrgencia] = useState('');
  const [tramite, setTramite] = useState('');
  const [estadoBoletin, setEstadoBoletin] = useState('');
  const [origen, setOrigen] = useState('');
  const [detalle, setDetalle] = useState('');
  const [boletinBusqueda, setBoletinBusqueda] = useState('');
  const [resultadosBoletin, setResultadosBoletin] = useState([]);
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [resultadosFecha, setResultadosFecha] = useState([]);
  const [comisionFiltro, setComisionFiltro] = useState('');
  const [tipoFiltro, setTipoFiltro] = useState('');
  const [resultadosFiltro, setResultadosFiltro] = useState([]);
  const [boletinSeleccionado, setBoletinSeleccionado] = useState(null);
  const [minutasVisibles, setMinutasVisibles] = useState([]);

  const buscar = async () => {
    const res = await fetch('/api/buscar?q=' + encodeURIComponent(q));
    const data = await res.json();
    setResultados(data);
  };

  const buscarPorBoletin = async () => {
    const res = await fetch('/api/buscarBoletin?boletin=' + encodeURIComponent(boletinBusqueda));
    const data = await res.json();
    setResultadosBoletin(data);
  };

  const buscarPorFecha = async () => {
    if (!fechaDesde || !fechaHasta) {
      alert('Selecciona ambas fechas');
      return;
    }
  
    const res = await fetch(`/api/buscarPorFecha?desde=${fechaDesde}&hasta=${fechaHasta}`);
    const data = await res.json();
    setResultadosFecha(data);
  };  

  const buscarPorComisionTipo = async () => {
    const params = new URLSearchParams();
    if (comisionFiltro) params.append('comision', comisionFiltro);
    if (tipoFiltro) params.append('tipo', tipoFiltro);
  
    const res = await fetch('/api/buscarPorComisionTipo?' + params.toString());
    const data = await res.json();
    setResultadosFiltro(data);
  };  

  const guardar = async () => {
    const datos = {
      titulo,
      contenido,
      asistentes: asistentes.split(',').map(a => a.trim()),
      tags: tags.split(',').map(t => t.trim()),
      proyecto,
      fecha: new Date().toISOString(),
      boletin,
      comision,
      tipo_evento: tipoEvento,
      hora_inicio: horaInicio,
      hora_fin: horaFin,
      urgencia,
      tramite,
      estado: estadoBoletin,
      origen,
      detalle
    };
  
    console.log('🟢 Datos enviados:', datos); // ← DEBUG
  
    if (modoEdicion && idEditando) {
      await fetch(`/api/minutas?id=${idEditando}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
      });
      setMensaje('✅ Minuta actualizada');
    } else {
      await fetch('/api/minutas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
      });
      setMensaje('✅ Minuta guardada');
    }
  
    setTitulo('');
    setContenido('');
    setAsistentes('');
    setTags('');
    setProyecto('');
    setBoletin('');
    setComision('');
    setTipoEvento('');
    setHoraInicio('');
    setHoraFin('');
    setUrgencia('');
    setTramite('');
    setEstadoBoletin('');
    setOrigen('');
    setDetalle('');
    setModoEdicion(false);
    setIdEditando(null);
  
    await new Promise(resolve => setTimeout(resolve, 300));
    await obtenerTodas();
    setTimeout(() => setMensaje(''), 3000);
  };
  
  
  
  
  const eliminarMinuta = async (id) => {
    if (!confirm('¿Estás seguro que quieres eliminar esta minuta?')) return;
  
    const res = await fetch('/api/eliminar?id=' + id, { method: 'DELETE' });
  
    if (res.ok) {
      setMensaje('✅ Minuta eliminada correctamente');
      setTodas(todas.filter((minuta) => minuta.id !== id));
    } else {
      setMensaje('❌ Error al eliminar la minuta');
    }
  
    setTimeout(() => setMensaje(''), 3000);
  };

  const obtenerTodas = async () => {
    const res = await fetch('/api/todas');
    const data = await res.json();
    setTodas([...data]);
  };

  const editarMinuta = (minuta) => {
    setModoEdicion(true);
    setIdEditando(minuta.id);
  
    setTitulo(minuta.titulo || '');
    setContenido(minuta.contenido || '');
    setAsistentes(minuta.asistentes?.join(', ') || '');
    setTags(minuta.tags?.join(', ') || '');
    setProyecto(minuta.proyecto || '');
  
    setBoletin(minuta.boletin || '');
    setComision(minuta.comision || '');
    setTipoEvento(minuta.tipo_evento || '');
    setHoraInicio(minuta.hora_inicio || '');
    setHoraFin(minuta.hora_fin || '');
    setUrgencia(minuta.urgencia || '');
    setTramite(minuta.tramite || '');
    setEstadoBoletin(minuta.estado || '');
    setOrigen(minuta.origen || '');
    setDetalle(minuta.detalle || '');
  };

  useEffect(() => {
    obtenerTodas(); // al cargar la página
  }, []);

  const agruparPorFecha = (minutas) => {
    const grupos = {};
  
    minutas.forEach((minuta) => {
      const fechaLegible = new Date(minuta.fecha).toLocaleDateString('es-CL', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
  
      if (!grupos[fechaLegible]) {
        grupos[fechaLegible] = [];
      }
  
      grupos[fechaLegible].push(minuta);
    });
  
    return grupos;
  };
  
  const resultadosAgrupados = agruparPorFecha(resultadosFecha);

  {Object.entries(resultadosAgrupados).map(([fecha, items], index) => (
    <div key={index} style={{ marginBottom: 40 }}>
      <h3 style={{ marginBottom: 10 }}>📅 {fecha}</h3>
      <TablaMinutas data={items} />
    </div>
  ))}

  return (
    <div style={{ padding: 20 }}>
      <h1>Minutas</h1>
      {mensaje && <p style={{ color: 'green', fontWeight: 'bold' }}>{mensaje}</p>}
      <h2>Agregar nueva</h2>
      <input value={titulo} onChange={e => setTitulo(e.target.value)} placeholder="Título" />
      
      <input
        value={asistentes}
        onChange={(e) => setAsistentes(e.target.value)}
        placeholder="Asistentes (separados por coma)"
        style={{ display: 'block', marginBottom: 10, width: 300 }}
      />

      <input
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        placeholder="Tags o categorías (separados por coma)"
        style={{ display: 'block', marginBottom: 10, width: 300 }}
      />

      <input
        value={proyecto}
        onChange={(e) => setProyecto(e.target.value)}
        placeholder="Proyecto o área"
        style={{ display: 'block', marginBottom: 10, width: 300 }}
      />

      <br />
      <textarea value={contenido} onChange={e => setContenido(e.target.value)} placeholder="Contenido" rows={4} cols={50} />
      <br />
      <input value={boletin} onChange={e => setBoletin(e.target.value)} placeholder="Boletín (ej: 17169-04)" />

      <input value={comision} onChange={e => setComision(e.target.value)} placeholder="Comisión o Sala" />

      <input value={tipoEvento} onChange={e => setTipoEvento(e.target.value)} placeholder="Tipo de evento (comisión, sala...)" />

      <input value={horaInicio} onChange={e => setHoraInicio(e.target.value)} placeholder="Hora de inicio (ej: 15:00)" />

      <input value={horaFin} onChange={e => setHoraFin(e.target.value)} placeholder="Hora de fin (ej: 16:50)" />

      <input value={urgencia} onChange={e => setUrgencia(e.target.value)} placeholder="Urgencia (simple, suma...)" />

      <input value={tramite} onChange={e => setTramite(e.target.value)} placeholder="Trámite (ej: 1er trámite)" />

      <input value={estadoBoletin} onChange={e => setEstadoBoletin(e.target.value)} placeholder="Estado del boletín" />

      <input value={origen} onChange={e => setOrigen(e.target.value)} placeholder="Origen (Ejecutivo, Diputados...)" />

      <textarea value={detalle} onChange={e => setDetalle(e.target.value)} placeholder="Detalle del evento" rows={3} />

      <button onClick={guardar}>
        {modoEdicion ? 'Actualizar' : 'Guardar'}
      </button>

      <h2>Buscar minutas</h2>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Buscar por título o contenido"
      />
      <button onClick={buscar}>Buscar</button>

      <h2>{q ? 'Resultados de búsqueda' : 'Todas las minutas guardadas'}</h2>

      <TablaMinutasConAcciones
      data={q ? resultados : todas}
      onEditar={editarMinuta}
      onEliminar={eliminarMinuta}
      onVerDetalle={(minuta) => setBoletinSeleccionado(minuta)}
      />

      <h2>Buscar por boletín</h2>
      <input
        value={boletinBusqueda}
        onChange={(e) => setBoletinBusqueda(e.target.value)}
        placeholder="Ej: 17169-04"
        style={{ marginRight: 10 }}
      />
      <button onClick={buscarPorBoletin}>Buscar</button>

      <ul>
      {resultadosBoletin.map((r, i) => (
        <li key={i} style={{ marginBottom: 10 }}>
          <strong>{r.titulo}</strong><br />
          <small>Boletín: {r.boletin}</small><br />
          {r.comision && <p><strong>Comisión:</strong> {r.comision}</p>}
          {r.fecha && <p><strong>Fecha:</strong> {r.fecha}</p>}
          <button onClick={() => setBoletinSeleccionado(r)} style={{ marginTop: 5 }}>
            Ver detalles
          </button>
        </li>
        ))}
      </ul>

      {boletinSeleccionado && (
      <div style={{ border: '1px solid #ccc', padding: 10, marginTop: 20 }}>
        <h3>📄 Detalle del boletín</h3>
        <p><strong>Título:</strong> {boletinSeleccionado.titulo}</p>
        <p><strong>Boletín:</strong> {boletinSeleccionado.boletin}</p>
        <p><strong>Fecha:</strong> {boletinSeleccionado.fecha}</p>
        <p><strong>Comisión:</strong> {boletinSeleccionado.comision}</p>
        <p><strong>Tipo de evento:</strong> {boletinSeleccionado.tipo_evento}</p>
        <p><strong>Trámite:</strong> {boletinSeleccionado.tramite}</p>
        <p><strong>Urgencia:</strong> {boletinSeleccionado.urgencia}</p>
        <p><strong>Estado:</strong> {boletinSeleccionado.estado}</p>
        <p><strong>Origen:</strong> {boletinSeleccionado.origen}</p>
        <p><strong>Horario:</strong> {boletinSeleccionado.hora_inicio} - {boletinSeleccionado.hora_fin}</p>
        <p><strong>Contenido:</strong> {boletinSeleccionado.contenido}</p>
        <p><strong>Detalle:</strong> {boletinSeleccionado.detalle}</p>

        <button onClick={() => setBoletinSeleccionado(null)} style={{ marginTop: 10 }}>
          ❌ Cerrar detalle
        </button>
      </div>
      )}

      <h2>Buscar por fecha</h2>
      <input type="date" value={fechaDesde} onChange={e => setFechaDesde(e.target.value)} />
      <input type="date" value={fechaHasta} onChange={e => setFechaHasta(e.target.value)} style={{ marginLeft: 10 }} />
      <button onClick={buscarPorFecha} style={{ marginLeft: 10 }}>Buscar</button>

      {Object.entries(resultadosAgrupados).map(([fecha, items], index) => (
      <div key={index} style={{ marginBottom: 40 }}>
        <h3 style={{ marginBottom: 10 }}>📅 {fecha}</h3>
        <TablaMinutasConAcciones data={items} />
      </div>
      ))}

      <h2>Filtrar por Comisión y/o Tipo de Evento</h2>

      <select value={comisionFiltro} onChange={e => setComisionFiltro(e.target.value)}>
        <option value="">-- Comisión --</option>
        <option value="Educación - Cámara">Educación - Cámara</option>
        <option value="Hacienda - Senado">Hacienda - Senado</option>
        <option value="Sala de la Cámara">Sala de la Cámara</option>
      </select>

      <select value={tipoFiltro} onChange={e => setTipoFiltro(e.target.value)} style={{ marginLeft: 10 }}>
        <option value="">-- Tipo de evento --</option>
        <option value="comisión">Comisión</option>
        <option value="sala">Sala</option>
        <option value="investigadora">Investigadora</option>
      </select>

      <button onClick={buscarPorComisionTipo} style={{ marginLeft: 10 }}>Buscar</button>

      <ul>
        {resultadosFiltro.map((r, i) => (
          <li key={i} style={{ marginBottom: 10 }}>
            <strong>{r.titulo}</strong><br />
            <small>{r.fecha}</small><br />
            {r.comision && <p><strong>Comisión:</strong> {r.comision}</p>}
            {r.tipo_evento && <p><strong>Tipo:</strong> {r.tipo_evento}</p>}
            {r.boletin && <p><strong>Boletín:</strong> {r.boletin}</p>}
            {r.contenido}
          </li>
        ))}
      </ul>

      <hr />
      <h2>Todas las minutas guardadas</h2>

      <TablaMinutasConAcciones
        data={todas}
        onEditar={editarMinuta}
        onEliminar={eliminarMinuta}
        onVerDetalle={(minuta) => setBoletinSeleccionado(minuta)}
      />
    </div>
  );
}
