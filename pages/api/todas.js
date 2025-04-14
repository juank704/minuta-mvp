import { client } from '../../lib/elastic';

export default async function handler(req, res) {
  const result = await client.search({
    index: 'minutas',
    size: 100, // cantidad máxima de resultados
    query: {
      match_all: {}
    },
    sort: [{ fecha: { order: 'desc' } }]
  });

  res.status(200).json(result.hits.hits.map(hit => ({
    id: hit._id,
    ...hit._source
  })));
}