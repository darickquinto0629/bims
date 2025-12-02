import React from 'react';
export default function Table({ columns, data }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <table className="min-w-full">
        <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <tr>
            {columns.map((c) => (
              <th key={c.key} className="px-6 py-4 text-left text-sm font-semibold">
                {c.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-8 text-center text-gray-500">
                <div className="text-lg">No records found</div>
                <p className="text-sm mt-1">Try adjusting your search criteria</p>
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr key={row.id} className="hover:bg-blue-50 transition-colors duration-150">
                {columns.map((c) => (
                  <td key={c.key} className="px-6 py-4 text-sm text-gray-700">
                    {c.render ? c.render(row, row[c.key]) : row[c.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
