import React from 'react';
import { usePlanningStore } from '../../store/usePlanningStore';
import { useAuthStore } from '../../store/useAuthStore';
import api from '../../lib/api';
import { 
  Plus, 
  Copy, 
  Trash2, 
  LogOut, 
  Save,
  BookPlus,
  Library
} from 'lucide-react';

export default function TopBar({ onAddCurso, onAddCursos }) {
  const { 
    planeaciones, 
    selectedPlaneacion, 
    selectPlaneacion, 
    addPlaneacion, 
    deletePlaneacion,
    setPlaneaciones
  } = usePlanningStore();
  const { user, logout } = useAuthStore();

  const handleNewPlaneacion = async () => {
    try {
      const res = await api.post('/planeaciones', {
        nombre: 'Nueva Planeación',
        usuario: user,
        materias: []
      });
      addPlaneacion(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDuplicatePlaneacion = async () => {
    if (!selectedPlaneacion) return;
    try {
      const res = await api.post('/planeaciones', {
        nombre: selectedPlaneacion.nombre + ' (Copia)',
        usuario: user,
        materias: selectedPlaneacion.materias
      });
      addPlaneacion(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePlaneacion = async () => {
    if (!selectedPlaneacion) return;
    try {
      await api.delete(`/planeaciones/${selectedPlaneacion._id}`);
      deletePlaneacion(selectedPlaneacion._id);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async () => {
    if (!selectedPlaneacion) return;
    try {
      await api.put(`/planeaciones/${selectedPlaneacion._id}`, {
        nombre: selectedPlaneacion.nombre,
        materias: selectedPlaneacion.materias
      });
      alert('Planeación guardada con éxito');
    } catch (err) {
      console.error(err);
      alert('Error al guardar la planeación');
    }
  };

  return (
    <div className="h-16 border-b border-zinc-800 bg-zinc-950 flex items-center justify-between px-4 sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <select 
          className="bg-zinc-900 border border-zinc-800 text-white rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedPlaneacion?._id || ""}
          onChange={(e) => selectPlaneacion(e.target.value)}
        >
          <option value="" disabled>Seleccionar Planeación</option>
          {planeaciones.map(p => (
            <option key={p._id} value={p._id}>{p.nombre}</option>
          ))}
        </select>

        <button 
          onClick={handleNewPlaneacion}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded-md border border-zinc-800 transition-colors text-sm font-medium"
        >
          <Plus size={16} /> Nuevo
        </button>
        
        <button 
          onClick={handleDuplicatePlaneacion}
          disabled={!selectedPlaneacion}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-md border border-zinc-800 transition-colors text-sm font-medium"
        >
          <Copy size={16} /> Duplicar
        </button>

        <button 
          onClick={handleDeletePlaneacion}
          disabled={!selectedPlaneacion}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-red-950/30 hover:bg-red-900/50 text-red-400 disabled:opacity-50 disabled:cursor-not-allowed rounded-md border border-red-900/50 transition-colors text-sm font-medium"
        >
          <Trash2 size={16} /> Borrar
        </button>
      </div>

      <div className="flex items-center gap-3">
        <button 
          onClick={onAddCurso}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-blue-400 rounded-md border border-zinc-800 transition-colors text-sm font-medium"
        >
          <BookPlus size={16} /> Add Curso
        </button>
        <button 
          onClick={onAddCursos}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-blue-400 rounded-md border border-zinc-800 transition-colors text-sm font-medium"
        >
          <Library size={16} /> Add Cursos
        </button>

        <div className="w-px h-6 bg-zinc-800 mx-1"></div>

        <button 
          onClick={handleSave}
          disabled={!selectedPlaneacion}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors text-sm font-medium"
        >
          <Save size={16} /> Guardar
        </button>

        <button 
          onClick={logout}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 rounded-md border border-zinc-800 transition-colors text-sm font-medium"
        >
          <LogOut size={16} /> Salir
        </button>
      </div>
    </div>
  );
}
