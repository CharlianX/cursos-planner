import React from 'react';
import { usePlanningStore } from '../../store/usePlanningStore';
import DroppableRow from '../dnd/DroppableRow';
import { Plus } from 'lucide-react';

export default function PlanningArea({ onCourseClick }) {
  const { selectedPlaneacion, updatePlaneacionName, updateSelectedPlaneacionMaterias } = usePlanningStore();

  if (!selectedPlaneacion) return null;

  const handleAddRow = () => {
    updateSelectedPlaneacionMaterias([...selectedPlaneacion.materias, []]);
  };

  const handleRemoveRow = (indexToRemove) => {
    const newMaterias = selectedPlaneacion.materias.filter((_, i) => i !== indexToRemove);
    updateSelectedPlaneacionMaterias(newMaterias);
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto p-4 bg-zinc-950/80">
      <div className="mb-6 shrink-0">
        <input 
          type="text"
          value={selectedPlaneacion.nombre}
          onChange={(e) => updatePlaneacionName(selectedPlaneacion._id, e.target.value)}
          className="text-2xl font-bold bg-transparent border-b border-transparent hover:border-zinc-700 focus:border-blue-500 focus:outline-none text-zinc-100 px-1 py-1 w-full transition-colors"
        />
      </div>

      <div className="flex-1 space-y-4">
        {selectedPlaneacion.materias.map((rowItems, rowIndex) => {
          const previousCourses = new Set(
            selectedPlaneacion.materias.slice(0, rowIndex).flat()
          );

          return (
            <DroppableRow 
              key={`row-${rowIndex}`}
              rowId={`row-${rowIndex}`}
              items={rowItems}
              onCourseClick={onCourseClick}
              rowIndex={rowIndex}
              onDeleteRow={() => handleRemoveRow(rowIndex)}
              previousCourses={previousCourses}
            />
          );
        })}

        <button 
          onClick={handleAddRow}
          className="w-full py-4 border-2 border-dashed border-zinc-800 hover:border-zinc-600 rounded-xl flex items-center justify-center text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          <Plus size={24} />
        </button>
      </div>
    </div>
  );
}
