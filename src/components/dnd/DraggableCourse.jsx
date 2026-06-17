import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { BookOpen } from 'lucide-react';

export default function DraggableCourse({ course, index, onClick, prereqStatus = 'black' }) {
  // Simple hash function to generate a color hue from the career code
  const getCarreraColor = (carrera) => {
    let hash = 0;
    for (let i = 0; i < carrera.length; i++) {
      hash = carrera.charCodeAt(i) + ((hash << 5) - hash);
    }
    return `hsl(${Math.abs(hash) % 360}, 65%, 45%)`;
  };

  return (
    <Draggable draggableId={course.codigo} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={onClick}
          className={`group flex flex-col justify-between p-3 rounded-lg border shadow-sm select-none transition-all cursor-grab active:cursor-grabbing relative ${
            snapshot.isDragging 
              ? 'bg-zinc-800 border-zinc-600 shadow-xl scale-105 z-50' 
              : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/80'
          }`}
          style={{
            ...provided.draggableProps.style,
            borderLeftWidth: '4px',
            borderLeftColor: getCarreraColor(course.carrera)
          }}
        >
          {/* Indicator gem circle */}
          <div 
            className={`absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full border border-zinc-800 shadow-sm transition-colors duration-300 ${
              prereqStatus === 'green' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' :
              prereqStatus === 'red' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]' :
              'bg-zinc-950'
            }`}
          />

          <div className="flex items-start justify-between gap-2 mb-2">
            <span className="font-mono text-xs font-bold text-zinc-400 bg-zinc-950 px-1.5 py-0.5 rounded z-10">
              {course.codigo}
            </span>
            <span className="text-xs font-medium text-zinc-500 flex items-center gap-1 z-10">
              <BookOpen size={12} /> {course.no_creditos}
            </span>
          </div>
          <div className="text-sm font-medium text-zinc-200 line-clamp-3 leading-snug z-10">
            {course.nombre}
          </div>
        </div>
      )}
    </Draggable>
  );
}
