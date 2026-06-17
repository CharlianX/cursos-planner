import React, { useState } from 'react';
import api from '../../lib/api';
import { useDataStore } from '../../store/useDataStore';
import { useAuthStore } from '../../store/useAuthStore';
import { X } from 'lucide-react';

export default function BulkImportModal({ onClose }) {
  const { user } = useAuthStore();
  const { addMateriasBulk } = useDataStore();
  const [jsonText, setJsonText] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    try {
      const parsed = JSON.parse(jsonText);
      if (!Array.isArray(parsed)) {
        throw new Error('El JSON debe ser un arreglo (array) de objetos.');
      }
      
      // Inject user if missing
      const payload = parsed.map(item => ({
        ...item,
        usuario: item.usuario || user
      }));

      const res = await api.post('/materias/bulk', payload);
      addMateriasBulk(res.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Error parsing JSON');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-2xl shadow-2xl flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
          <h2 className="text-xl font-bold text-white">Importar Cursos (JSON)</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <p className="text-sm text-zinc-400">Pega un arreglo JSON con el formato correcto. El usuario será asignado automáticamente si se omite.</p>
          {error && <div className="text-red-400 text-sm bg-red-950/30 p-2 rounded border border-red-900">{error}</div>}
          <textarea
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            className="w-full h-[400px] bg-zinc-950 border border-zinc-800 rounded-md p-3 text-white font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="[
  {
    &quot;nombre&quot;: &quot;Materia 1&quot;,
    &quot;no_creditos&quot;: 3,
    &quot;codigo&quot;: &quot;ISIS-1001&quot;,
    &quot;prerrequisitos&quot;: [],
    &quot;carrera&quot;: &quot;ISIS&quot;
  }
]"
          />
        </div>

        <div className="p-4 border-t border-zinc-800 bg-zinc-900 flex justify-end gap-3 rounded-b-xl">
          <button onClick={onClose} className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-md text-sm font-medium transition-colors">Cancelar</button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors">Importar</button>
        </div>
      </div>
    </div>
  );
}
