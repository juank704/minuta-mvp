import { client } from '../../lib/elastic';

export default async function handler(req, res) {
  const { comision, tipo } = req.query;

  if (!comision && !tipo) {
    return res.status(400).json({ error: 'Debe enviar comisión, tipo, o ambos' });
  }

  const must = [];
  if (comision) must.push({ match: { comision } });
  if (tipo) must.push({ match: { tipo_evento: tipo } });

  const result = await client.search({
    index: 'minutas',
    size: 100,
    query: {
      bool: { must }
    },
    sort: [{ fecha: { order: 'desc' } }]
  });

  res.status(200).json(result.hits.hits.map(hit => hit._source));
}
