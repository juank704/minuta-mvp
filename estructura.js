const fs = require('fs');
const path = require('path');

const baseDir = __dirname;

const structure = [
  'pages',
  'pages/api',
  'lib',
  'public'
];

const files = {
  'lib/elastic.js': `import { Client } from '@elastic/elasticsearch';

export const client = new Client({
  node: process.env.ELASTIC_URL
});
`,

  'pages/api/minutas.js': `import { client } from '../../lib/elastic';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const minuta = req.body;
    await client.index({
      index: 'minutas',
      document: minuta
    });
    return res.status(201).json({ mensaje: 'Minuta guardada' });
  }
}
`,

  'pages/api/buscar.js': `import { client } from '../../lib/elastic';

export default async function handler(req, res) {
  const q = req.query.q || '';
  const result = await client.search({
    index: 'minutas',
    query: {
      multi_match: {
        query: q,
        fields: ['titulo^2', 'contenido', 'tags']
      }
    }
  });

  res.status(200).json(result.hits.hits.map(hit => hit._source));
}
`,

  'pages/index.js': `import { useState } from 'react';

export default function Home() {
  const [q, setQ] = useState('');
  const [resultados, setResultados] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [contenido, setContenido] = useState('');

  const buscar = async () => {
    const res = await fetch('/api/buscar?q=' + q);
    const data = await res.json();
    setResultados(data);
  };

  const guardar = async () => {
    await fetch('/api/minutas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ titulo, contenido, fecha: new Date().toISOString() })
    });
    setTitulo('');
    setContenido('');
    alert('Minuta guardada!');
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Minutas</h1>

      <h2>Agregar Minuta</h2>
      <input value={titulo} onChange={e => setTitulo(e.target.value)} placeholder="Título" />
      <br />
      <textarea value={contenido} onChange={e => setContenido(e.target.value)} placeholder="Contenido" rows={5} cols={40} />
      <br />
      <button onClick={guardar}>Guardar</button>

      <h2>Buscar Minutas</h2>
      <input value={q} onChange={e => setQ(e.target.value)} placeholder="Buscar..." />
      <button onClick={buscar}>Buscar</button>

      <ul>
        {resultados.map((r, i) => (
          <li key={i}>
            <strong>{r.titulo}</strong><br />
            {r.contenido}
          </li>
        ))}
      </ul>
    </div>
  );
}
`
};

// Crear carpetas
structure.forEach(dir => {
  const fullPath = path.join(baseDir, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
});

// Crear archivos
Object.entries(files).forEach(([filePath, content]) => {
  const fullPath = path.join(baseDir, filePath);
  fs.writeFileSync(fullPath, content, 'utf8');
});

console.log('✅ Estructura generada con éxito.');