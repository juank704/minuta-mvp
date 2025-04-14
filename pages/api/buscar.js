import { client } from '../../lib/elastic';

export default async function handler(req, res) {
  const q = req.query.q || '';

  const result = await client.search({
    index: 'minutas',
    query: {
      multi_match: {
        query: q,
        fields: ['titulo^2', 'contenido'],
        fuzziness: 'AUTO',
        operator: 'and'
      }
    }
  });

  res.status(200).json(result.hits.hits.map(hit => hit._source));
}