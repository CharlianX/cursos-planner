import React, { useMemo } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import DraggableCourse from '../dnd/DraggableCourse';
import { useDataStore } from '../../store/useDataStore';
import { usePlanningStore } from '../../store/usePlanningStore';

export default function CourseArea({ onCourseClick }) {
  const { materias } = useDataStore();
  const { selectedPlaneacion } = usePlanningStore();

  const availableMaterias = useMemo(() => {
    if (!selectedPlaneacion) return materias;
    const usedCodes = new Set(selectedPlaneacion.materias.flat());
    return materias.filter(m => !usedCodes.has(m.codigo));
  }, [materias, selectedPlaneacion]);

  const groupedMaterias = useMemo(() => {
    const groups = {};
    availableMaterias.forEach(m => {
      if (!groups[m.carrera]) groups[m.carrera] = [];
      groups[m.carrera].push(m);
    });
    // Sort alphanumerically
    Object.keys(groups).forEach(carrera => {
      groups[carrera].sort((a, b) => a.codigo.localeCompare(b.codigo));
    });
    return groups;
  }, [availableMaterias]);

  return (
    <div className="flex flex-col h-full bg-zinc-950 p-4 overflow-y-auto">
      <h2 className="text-xl font-bold mb-4 text-zinc-100 shrink-0">Cursos por carrera</h2>
      
      <Droppable droppableId="courses-area" isDropDisabled={false}>
        {(provided, snapshot) => (
          <div 
            ref={provided.innerRef} 
            {...provided.droppableProps}
            className={`flex-1 min-h-[200px] rounded-xl transition-colors ${snapshot.isDraggingOver ? 'bg-zinc-900/50' : ''}`}
          >
            {Object.keys(groupedMaterias).length === 0 && (
              <div className="text-zinc-500 text-sm italic p-4">No hay cursos disponibles.</div>
            )}
            
            {Object.entries(groupedMaterias).map(([carrera, cursos]) => (
              <div key={carrera} className="mb-6">
                <h3 className="text-lg font-semibold text-zinc-300 mb-3 border-b border-zinc-800 pb-1">{carrera}</h3>
                <div className="flex flex-wrap gap-3 pb-4">
                  {cursos.map((curso) => {
                    // Find the absolute index in availableMaterias to satisfy dnd
                    const globalIndex = availableMaterias.findIndex(m => m.codigo === curso.codigo);
                    return (
                      <div key={curso.codigo} className="w-[180px] shrink-0">
                        <DraggableCourse 
                          course={curso} 
                          index={globalIndex} 
                          onClick={() => onCourseClick(curso.codigo)}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
