// store/resultStore.js
import { create } from 'zustand';

const useResultStore = create((set) => ({
  results: {},
  setResults: (data) => set({ results: data }),
}));

export default useResultStore;
