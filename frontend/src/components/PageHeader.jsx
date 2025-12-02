import React from 'react';
export default function PageHeader({ title, actions }) {
  return (
    <div className="mb-8 flex items-center justify-between">
      <div>
        <h1 className="text-4xl font-bold text-gray-900">{title}</h1>
        <div className="h-1 w-16 bg-gradient-to-r from-blue-600 to-blue-400 rounded mt-2"></div>
      </div>
      <div className="flex items-center gap-3">{actions}</div>
    </div>
  );
}
