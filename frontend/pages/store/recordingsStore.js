// recordingsStore.js
import { create } from 'zustand';

const useRecordingsStore = create((set) => ({

  recordings: {},

  //  새로운 녹음 파일 추가
  addRecording: (pageName, uri) =>
    set((state) => ({
      recordings: {
        ...state.recordings,
        [pageName]: [...(state.recordings[pageName] || []), uri],
      },
    })),

  //  특정 페이지 recordings 초기화
  clearPageRecordings: (pageName) =>
    set((state) => {
      const updated = { ...state.recordings };
      delete updated[pageName];
      return { recordings: updated };
    }),

  //  모든 recordings 초기화 (앱 초기화 시 사용)
  clearAllRecordings: () => set({ recordings: {} }),
}));

export default useRecordingsStore;
