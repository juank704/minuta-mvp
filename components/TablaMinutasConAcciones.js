import React from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper
} from '@tanstack/react-table';

const columnHelper = createColumnHelper();

export function TablaMinutasConAcciones({ data, onEditar, onEliminar, onVerDetalle }) {

  const [filaExpandida, setFilaExpandida] = React.useState(null);
  const columns = [
    columnHelper.accessor('titulo', { header: 'Título' }),
    columnHelper.accessor('boletin', {
        header: 'Boletín',
        cell: ({ row, getValue }) => {
          const r = row.original;
          return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>{getValue()}</span>
              <button onClick={() => setFilaExpandida(r.id === filaExpandida ? null : r.id)}>👁</button>
            </div>
          );
        }
    }),
    columnHelper.accessor('comision', { header: 'Comisión' }),
    columnHelper.accessor('urgencia', { header: 'Urgencia' }),
    columnHelper.accessor('tipo_evento', { header: 'Tipo' }),
    columnHelper.accessor(row => `${row.hora_inicio || ''} - ${row.hora_fin || ''}`, {
      id: 'horario',
      header: 'Horario'
    }),
    columnHelper.display({
      id: 'acciones',
      header: 'Acciones',
      cell: ({ row }) => {
        const r = row.original;
        return (
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => onEditar(r)}>✏</button>
            <button onClick={() => onEliminar(r.id)} style={{ color: 'red' }}>🗑</button>
          </div>
        );
      }
    })
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel()
  });

  return (
    <table border="1" cellPadding="6" style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead style={{ backgroundColor: '#f5f5f5' }}>
        {table.getHeaderGroups().map(headerGroup => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map(header => (
              <th key={header.id}>
                {flexRender(header.column.columnDef.header, header.getContext())}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
      {table.getRowModel().rows.map(row => {
        const r = row.original;
        return (
            <React.Fragment key={row.id}>
            <tr>
                {row.getVisibleCells().map(cell => (
                <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
                ))}
            </tr>

            {filaExpandida === r.id && (
                <tr>
                <td colSpan={columns.length}>
                    <div style={{ background: '#f9f9f9', padding: 10 }}>
                    <p><strong>Contenido:</strong> {r.contenido}</p>
                    <p><strong>Detalle:</strong> {r.detalle}</p>
                    <p><strong>Asistentes:</strong> {r.asistentes?.join(', ')}</p>
                    <p><strong>Tags:</strong> {r.tags?.join(', ')}</p>
                    <p><strong>Proyecto:</strong> {r.proyecto}</p>
                    <p><strong>Estado:</strong> {r.estado}</p>
                    <p><strong>Origen:</strong> {r.origen}</p>
                    </div>
                </td>
                </tr>
            )}
            </React.Fragment>
        );
        })}
      </tbody>
    </table>
  );
}