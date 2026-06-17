import { create } from 'zustand';

export const usePlanningStore = create((set, get) => ({
  planeaciones: [],
  selectedPlaneacion: null, // The currently active planning object

  setPlaneaciones: (planeaciones) => set({ planeaciones }),
  
  selectPlaneacion: (id) => set((state) => ({
    selectedPlaneacion: state.planeaciones.find(p => p._id === id) || null
  })),

  addPlaneacion: (planeacion) => set((state) => ({
    planeaciones: [...state.planeaciones, planeacion],
    selectedPlaneacion: planeacion
  })),

  updatePlaneacionName: (id, nombre) => set((state) => {
    const updated = state.planeaciones.map(p => p._id === id ? { ...p, nombre } : p);
    return {
      planeaciones: updated,
      selectedPlaneacion: state.selectedPlaneacion?._id === id ? { ...state.selectedPlaneacion, nombre } : state.selectedPlaneacion
    };
  }),

  deletePlaneacion: (id) => set((state) => ({
    planeaciones: state.planeaciones.filter(p => p._id !== id),
    selectedPlaneacion: state.selectedPlaneacion?._id === id ? null : state.selectedPlaneacion
  })),

  // Drag and drop updates for the local planning state
  updateSelectedPlaneacionMaterias: (newMateriasArray) => set((state) => {
    if (!state.selectedPlaneacion) return state;
    const updatedSelected = { ...state.selectedPlaneacion, materias: newMateriasArray };
    return {
      selectedPlaneacion: updatedSelected,
      planeaciones: state.planeaciones.map(p => p._id === updatedSelected._id ? updatedSelected : p)
    };
  }),
}));
