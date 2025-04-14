import { client } from '../../lib/elastic';

export default async function handler(req, res) {
  if (req.method !== 'DELETE') return res.status(405).end();

  const { id } = req.query;

  try {
    await client.delete({
      index: 'minutas',
      id: id
    });

    return res.status(200).json({ mensaje: 'Minuta eliminada' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}