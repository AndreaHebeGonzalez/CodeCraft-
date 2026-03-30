import { type StateCreator } from "zustand";

export type TaskTreeSlice = {
  openByDepth: Record<number, string | null>
  openNode: (depth: number, nodeId: string) => void
  resetTree: () => void
}

export const taskTreeSlice : StateCreator<TaskTreeSlice> = (set) => ({
  openByDepth: {},
  openNode: (depth, nodeId) =>
    set(state => {
      const next = { ...state.openByDepth }

      //Se click en el mismo nodo abierto y a partir de ese nivel se deben cerrar todos los niveles posteriores

      if(next[depth] === nodeId) {
        Object.keys(next) //Retorna siempre string, y map convierte a number
        .map(Number)
        .filter(d => d >= depth)
        .forEach(d => delete next[d])
        
        return { openByDepth: next }
      }

      // Se hace click en un nodo hermano y deben cerrarse los niveles mayores a ese nodo abierto y reemplazarse ese nodo abierto por el nodo hermano. 
      Object.keys(next)
        .map(Number)
        .filter(d => d > depth)
        .forEach(d => delete next[d])

      next[depth] = nodeId

      return { openByDepth: next }
    }),

  resetTree: () => set({ openByDepth: {} })
})