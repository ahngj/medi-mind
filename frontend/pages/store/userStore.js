import { create } from 'zustand';

const useUserStore = create((set) => ({
  user: {
    name: '',
    age: '',
    gender: '',
  },
  setUser: (newUser) => set({ user: newUser }),
}));

export default useUserStore;