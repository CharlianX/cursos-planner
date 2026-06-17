import { create } from 'zustand';

export const useDataStore = create((set, get) => ({
  materias: [],
  setMaterias: (materias) => set({ materias }),
  addMateria: (materia) => set((state) => ({ materias: [...state.materias, materia] })),
  updateMateria: (id, updatedMateria) => set((state) => ({
    materias: state.materias.map((m) => (m._id === id ? updatedMateria : m)),
  })),
  deleteMateria: (id) => set((state) => ({
    materias: state.materias.filter((m) => m._id !== id),
  })),
  addMateriasBulk: (newMaterias) => set((state) => ({
    materias: [...state.materias, ...newMaterias]
  }))
}));
