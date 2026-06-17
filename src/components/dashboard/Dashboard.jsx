import React, { useState, useEffect } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import TopBar from '../layout/TopBar';
import CourseArea from './CourseArea';
import PlanningArea from './PlanningArea';
import CourseModal from '../modals/CourseModal';
import BulkImportModal from '../modals/BulkImportModal';
import api from '../../lib/api';
import { useDataStore } from '../../store/useDataStore';
import { usePlanningStore } from '../../store/usePlanningStore';
import { useAuthStore } from '../../store/useAuthStore';

export default function Dashboard() {
  const { setMaterias, materias } = useDataStore();
  const { setPlaneaciones, selectedPlaneacion, updateSelectedPlaneacionMaterias } = usePlanningStore();
  const { user } = useAuthStore();

  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [selectedCourseForEdit, setSelectedCourseForEdit] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [materiasRes, planeacionesRes] = await Promise.all([
          api.get('/materias'),
          api.get(`/planeaciones/${user}`)
        ]);
        setMaterias(materiasRes.data);
        setPlaneaciones(planeacionesRes.data);
      } catch (err) {
        console.error("Error fetching data", err);
      }
    };
    fetchData();
  }, [user, setMaterias, setPlaneaciones]);

  const handleDragEnd = (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    // source/dest logic
    // droppableId = "courses-area" OR "row-X"
    const sourceIsCourseArea = source.droppableId === 'courses-area';
    const destIsCourseArea = destination.droppableId === 'courses-area';

    if (!selectedPlaneacion) return;

    let newMateriasArray = [...selectedPlaneacion.materias];

    if (sourceIsCourseArea && !destIsCourseArea) {
      // moving from CourseArea to a row
      const destRowIndex = parseInt(destination.droppableId.split('-')[1]);
      
      // Prevent duplicate in planning
      const isAlreadyInPlanning = newMateriasArray.some(row => row.includes(draggableId));
      if (isAlreadyInPlanning) return; // cancel drag

      if (!newMateriasArray[destRowIndex]) newMateriasArray[destRowIndex] = [];
      newMateriasArray[destRowIndex].splice(destination.index, 0, draggableId);
      
    } else if (!sourceIsCourseArea && destIsCourseArea) {
      // moving from a row back to CourseArea
      const sourceRowIndex = parseInt(source.droppableId.split('-')[1]);
      newMateriasArray[sourceRowIndex].splice(source.index, 1);

    } else if (!sourceIsCourseArea && !destIsCourseArea) {
      // moving between rows or within same row
      const sourceRowIndex = parseInt(source.droppableId.split('-')[1]);
      const destRowIndex = parseInt(destination.droppableId.split('-')[1]);

      newMateriasArray[sourceRowIndex].splice(source.index, 1);
      if (!newMateriasArray[destRowIndex]) newMateriasArray[destRowIndex] = [];
      newMateriasArray[destRowIndex].splice(destination.index, 0, draggableId);
    }

    updateSelectedPlaneacionMaterias(newMateriasArray);
  };

  const handleCourseClick = (courseId) => {
    const course = materias.find(m => m.codigo === courseId);
    if (course) {
      setSelectedCourseForEdit(course);
      setIsCourseModalOpen(true);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-zinc-950 text-white overflow-hidden">
      <TopBar 
        onAddCurso={() => { setSelectedCourseForEdit(null); setIsCourseModalOpen(true); }}
        onAddCursos={() => setIsBulkModalOpen(true)}
      />
      
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex-1 flex overflow-hidden">
          {/* Left Side: Planning Area */}
          <div className="w-1/2 md:w-3/5 border-r border-zinc-800 flex flex-col bg-zinc-900/50">
            {selectedPlaneacion ? (
              <PlanningArea onCourseClick={handleCourseClick} />
            ) : (
              <div className="flex-1 flex items-center justify-center text-zinc-500">
                Selecciona o crea una planeación para empezar.
              </div>
            )}
          </div>

          {/* Right Side: Course Area */}
          <div className="w-1/2 md:w-2/5 flex flex-col bg-zinc-950">
            <CourseArea onCourseClick={handleCourseClick} />
          </div>
        </div>
      </DragDropContext>

      {/* Modals */}
      {isCourseModalOpen && (
        <CourseModal 
          onClose={() => { setIsCourseModalOpen(false); setSelectedCourseForEdit(null); }}
          courseToEdit={selectedCourseForEdit}
        />
      )}
      {isBulkModalOpen && (
        <BulkImportModal 
          onClose={() => setIsBulkModalOpen(false)}
        />
      )}
    </div>
  );
}
