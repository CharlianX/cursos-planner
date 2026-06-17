import React, { useState, useEffect } from 'react';
import api from '../../lib/api';
import { useDataStore } from '../../store/useDataStore';
import { useAuthStore } from '../../store/useAuthStore';
import { X, Plus, Trash2 } from 'lucide-react';

export default function CourseModal({ onClose, courseToEdit }) {
  const { user } = useAuthStore();
  const { addMateria, updateMateria, deleteMateria } = useDataStore();
  const [formData, setFormData] = useState({
    nombre: '',
    no_creditos: 3,
    codigo: '',
    carrera: '',
    prerrequisitos: [],
    usuario: user
  });

  // Local state for building the DNF (Disjunctive Normal Form)
  // represented as array of strings (comma separated for the UI, then split)
  const [prereqGroups, setPrereqGroups] = useState(['']);

  useEffect(() => {
    if (courseToEdit) {
      setFormData({
        ...courseToEdit,
        prerrequisitos: courseToEdit.prerrequisitos || []
      });
      if (courseToEdit.prerrequisitos && courseToEdit.prerrequisitos.length > 0) {
        setPrereqGroups(courseToEdit.prerrequisitos.map(group => group.join(', ')));
      }
    }
  }, [courseToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'no_creditos' ? Number(value) : value }));
  };

  const handlePrereqChange = (index, value) => {
    const newGroups = [...prereqGroups];
    newGroups[index] = value;
    setPrereqGroups(newGroups);
  };

  const addPrereqGroup = () => setPrereqGroups([...prereqGroups, '']);
  const removePrereqGroup = (index) => setPrereqGroups(prereqGroups.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Parse prereqs: from "ISIS-1104, MATE-1203" to ["ISIS-1104", "MATE-1203"]
    const parsedPrereqs = prereqGroups
      .map(group => group.split(',').map(s => s.trim()).filter(s => s !== ''))
      .filter(group => group.length > 0);

    const payload = { ...formData, prerrequisitos: parsedPrereqs };

    try {
      if (courseToEdit) {
        const res = await api.put(`/materias/${courseToEdit._id}`, payload);
        updateMateria(courseToEdit._id, res.data);
      } else {
        const res = await api.post('/materias', payload);
        addMateria(res.data);
      }
      onClose();
    } catch (err) {
      alert('Error al guardar: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('¿Seguro que quieres borrar este curso?')) return;
    try {
      await api.delete(`/materias/${courseToEdit._id}`);
      deleteMateria(courseToEdit._id);
      onClose();
    } catch (err) {
      alert('Error al borrar');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-md shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-4 border-b border-zinc-800 shrink-0">
          <h2 className="text-xl font-bold text-white">{courseToEdit ? 'Editar Curso' : 'Nuevo Curso'}</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 overflow-y-auto space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-400">Código</label>
            <input required type="text" name="codigo" value={formData.codigo} onChange={handleChange} disabled={!!courseToEdit} className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 disabled:opacity-50" placeholder="ISIS-1221"/>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-400">Nombre</label>
            <input required type="text" name="nombre" value={formData.nombre} onChange={handleChange} className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500" placeholder="Introducción a la Programación"/>
          </div>
          <div className="flex gap-4">
            <div className="space-y-1 w-1/2">
              <label className="text-xs font-medium text-zinc-400">Créditos</label>
              <input required type="number" name="no_creditos" value={formData.no_creditos} onChange={handleChange} className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500" min="0"/>
            </div>
            <div className="space-y-1 w-1/2">
              <label className="text-xs font-medium text-zinc-400">Carrera</label>
              <input required type="text" name="carrera" value={formData.carrera} onChange={handleChange} className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500" placeholder="ISIS"/>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-zinc-800">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-zinc-400">Prerrequisitos (Opcional - Forma Normal Disyuntiva)</label>
              <button type="button" onClick={addPrereqGroup} className="text-blue-400 hover:text-blue-300 text-xs flex items-center gap-1">
                <Plus size={12}/> Grupo "O"
              </button>
            </div>
            <p className="text-[10px] text-zinc-500 leading-tight mb-2">Cada caja representa un grupo "Y" (separa códigos con comas). Si el estudiante cumple con CUALQUIER caja (grupo), cumple el prerrequisito.</p>
            
            {prereqGroups.map((group, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <input 
                  type="text" 
                  value={group} 
                  onChange={(e) => handlePrereqChange(idx, e.target.value)} 
                  className="flex-1 bg-zinc-950 border border-zinc-800 rounded-md px-3 py-1.5 text-sm text-white focus:ring-2 focus:ring-blue-500" 
                  placeholder="ISIS-1104, MATE-1203"
                />
                <button type="button" onClick={() => removePrereqGroup(idx)} className="text-zinc-500 hover:text-red-400">
                  <X size={16}/>
                </button>
              </div>
            ))}
          </div>

        </form>
        <div className="p-4 border-t border-zinc-800 bg-zinc-900 flex justify-between rounded-b-xl shrink-0">
          {courseToEdit ? (
            <button type="button" onClick={handleDelete} className="px-4 py-2 bg-red-950/50 hover:bg-red-900 text-red-400 rounded-md text-sm font-medium transition-colors flex items-center gap-2">
              <Trash2 size={16}/> Borrar
            </button>
          ) : <div></div>}
          <div className="flex gap-3">
            <button onClick={onClose} className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-md text-sm font-medium transition-colors">Cancelar</button>
            <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors">Guardar</button>
          </div>
        </div>
      </div>
    </div>
  );
}
