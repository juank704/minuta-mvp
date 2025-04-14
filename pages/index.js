import { useState, useEffect } from 'react';

export default function Home() {
  const [q, setQ] = useState('');
  const [resultados, setResultados] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [contenido, setContenido] = useState('');
  const [todas, setTodas] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [modoEdicion, setModoEdicion] = useState(false);
  const [idEditando, setIdEditando] = useState(null);


  const buscar = async () => {
    const res = await fetch('/api/buscar?q=' + encodeURIComponent(q));
    const data = await res.json();
    setResultados(data);
  };

  const guardar = async () => {
    if (modoEdicion && idEditando) {
      await fetch(`/api/minutas?id=${idEditando}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titulo, contenido })
      });
      setMensaje('✅ Minuta actualizada');
    } else {
      await fetch('/api/minutas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo,
          contenido,
          fecha: new Date().toISOString()
        })
      });
      setMensaje('✅ Minuta guardada');
    }
  
    setTitulo('');
    setContenido('');
    setModoEdicion(false);
    setIdEditando(null);
  
    await new Promise(resolve => setTimeout(resolve, 300)); // 🕓 espera breve para asegurar que Elastic actualizó
    await obtenerTodas(); // ✅ importante usar await
  
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
    setTitulo(minuta.titulo);
    setContenido(minuta.contenido);
  };

  useEffect(() => {
    obtenerTodas(); // al cargar la página
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Minutas</h1>
      {mensaje && <p style={{ color: 'green', fontWeight: 'bold' }}>{mensaje}</p>}
      <h2>Agregar nueva</h2>
      <input value={titulo} onChange={e => setTitulo(e.target.value)} placeholder="Título" />
      <br />
      <textarea value={contenido} onChange={e => setContenido(e.target.value)} placeholder="Contenido" rows={4} cols={50} />
      <br />
      <button onClick={guardar}>
        {modoEdicion ? 'Actualizar' : 'Guardar'}
      </button>

      <h2>Buscar minutas</h2>
      <input value={q} onChange={e => setQ(e.target.value)} placeholder="Buscar..." />
      <button onClick={buscar}>Buscar</button>

      <h3>Resultados de búsqueda:</h3>
      <ul>
        {resultados.map((r, i) => (
          <li key={i}>
            <strong>{r.titulo}</strong><br />
            <small>{r.fecha}</small><br />
            {r.contenido}
          </li>
        ))}
      </ul>

      <hr />
      <h2>Todas las minutas guardadas</h2>
      <ul>
        {todas.map((r, i) => (
          <li key={i} style={{ marginBottom: 10 }}>
            <strong>{r.titulo}</strong><br />
            <small>{r.fecha}</small><br />
            {r.contenido}<br />
            <button onClick={() => editarMinuta(r)} style={{ marginTop: 5, marginRight: 10 }}>✏ Editar</button>
            <button onClick={() => eliminarMinuta(r.id)} style={{ marginTop: 5, color: 'red' }}>🗑 Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
