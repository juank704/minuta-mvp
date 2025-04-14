import { client } from '../../lib/elastic';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'POST') {
    const {
      titulo,
      contenido,
      asistentes,
      tags,
      proyecto,
      fecha,
      boletin,
      comision,
      tipo_evento,
      hora_inicio,
      hora_fin,
      urgencia,
      tramite,
      estado,
      origen,
      detalle
    } = req.body;

    await client.index({
      index: 'minutas',
      document: {
        titulo,
        contenido,
        asistentes,
        tags,
        proyecto,
        fecha,
        boletin,
        comision,
        tipo_evento,
        hora_inicio,
        hora_fin,
        urgencia,
        tramite,
        estado,
        origen,
        detalle
      }
    });

    return res.status(201).json({ mensaje: 'Minuta guardada' });
  }

  if (req.method === 'PUT') {
    const {
      titulo,
      contenido,
      asistentes,
      tags,
      proyecto,
      boletin,
      comision,
      tipo_evento,
      hora_inicio,
      hora_fin,
      urgencia,
      tramite,
      estado,
      origen,
      detalle
    } = req.body;

    try {
      await client.update({
        index: 'minutas',
        id,
        doc: {
          titulo,
          contenido,
          asistentes,
          tags,
          proyecto,
          boletin,
          comision,
          tipo_evento,
          hora_inicio,
          hora_fin,
          urgencia,
          tramite,
          estado,
          origen,
          detalle
        }
      });

      return res.status(200).json({ mensaje: 'Minuta actualizada' });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  res.status(405).end();
}