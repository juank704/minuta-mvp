import { client } from '../../lib/elastic';

export default async function handler(req, res) {
  const boletin = req.query.boletin;

  if (!boletin) {
    return res.status(400).json({ error: 'Boletín requerido' });
  }

  const result = await client.search({
    index: 'minutas',
    query: {
      match: {
        boletin: boletin
      }
    }
  });

  res.status(200).json(result.hits.hits.map(hit => hit._source));
}