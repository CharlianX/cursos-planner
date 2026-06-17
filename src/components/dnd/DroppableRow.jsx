import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import DraggableCourse from './DraggableCourse';
import { useDataStore } from '../../store/useDataStore';
import { Trash2 } from 'lucide-react';

export default function DroppableRow({ rowId, items, onCourseClick, rowIndex, onDeleteRow, previousCourses }) {
  const { materias } = useDataStore();

  const rowCourses = items.map(code => materias.find(m => m.codigo === code)).filter(Boolean);
  const totalCredits = rowCourses.reduce((sum, course) => sum + course.no_creditos, 0);

  return (
    <div className="flex items-stretch gap-3 min-h-[120px]">
      {/* Left side: Credits */}
      <div className="flex flex-col items-center justify-center w-12 shrink-0 bg-zinc-900 rounded-xl border border-zinc-800 py-3">
        <span className="text-xl font-bold text-zinc-300 mb-2">{totalCredits}</span>
        <span 
          className="text-[10px] uppercase text-zinc-500 font-semibold tracking-wider"
          style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
        >
          Créditos
        </span>
      </div>

      {/* Center: Droppable area */}
      <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl p-3">
        <Droppable droppableId={rowId} direction="horizontal">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`flex flex-wrap gap-3 min-h-[96px] h-full rounded-lg transition-colors ${snapshot.isDraggingOver ? 'bg-zinc-800/50' : ''}`}
            >
              {items.map((courseCode, index) => {
                const course = materias.find(m => m.codigo === courseCode);
                if (!course) return null;

                let status = 'green';
                if (course.prerrequisitos && course.prerrequisitos.length > 0) {
                  const isSatisfied = course.prerrequisitos.some(group => 
                    group.every(reqCode => previousCourses && previousCourses.has(reqCode))
                  );
                  status = isSatisfied ? 'green' : 'red';
                }

                return (
                  <div key={course.codigo} className="w-[180px]">
                    <DraggableCourse 
                      course={course} 
                      index={index} 
                      onClick={() => onCourseClick(course.codigo)} 
                      prereqStatus={status}
                    />
                  </div>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>

      {/* Right side: Delete button */}
      <button 
        onClick={onDeleteRow}
        className="w-12 shrink-0 flex items-center justify-center bg-zinc-900 hover:bg-red-950/30 text-zinc-600 hover:text-red-500 border border-zinc-800 hover:border-red-900/50 rounded-xl transition-colors"
        title="Eliminar fila"
      >
        <Trash2 size={20} />
      </button>
    </div>
  );
}
