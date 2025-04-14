import { client } from '../../lib/elastic';

export default async function handler(req, res) {
  const { desde, hasta } = req.query;

  if (!desde || !hasta) {
    return res.status(400).json({ error: 'Fechas requeridas' });
  }

  const result = await client.search({
    index: 'minutas',
    size: 100,
    query: {
      range: {
        fecha: {
          gte: desde,
          lte: hasta
        }
      }
    },
    sort: [{ fecha: { order: 'asc' } }]
  });

  res.status(200).json(result.hits.hits.map(hit => hit._source));
}