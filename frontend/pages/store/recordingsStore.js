// recordingsStore.js
import { create } from 'zustand';

const useRecordingsStore = create((set, get) => ({
  recordings: {},

  // 새로운 녹음 파일 추가
  addRecording: (pageName, uri) =>
    set((state) => {
      const updatedList = [...(state.recordings[pageName] || []), uri];

      console.log(`✅ [${pageName}] 저장된 녹음 목록:`);
      updatedList.forEach((u, idx) => {
        console.log(`   ${idx + 1}. ${u}`);
      });

      return {
        recordings: {
          ...state.recordings,
          [pageName]: updatedList,
        },
      };
    }),

  // 특정 페이지의 녹음 초기화
  clearPageRecordings: (pageName) =>
    set((state) => {
      const updated = { ...state.recordings };
      delete updated[pageName];

      console.log(`🧹 [${pageName}] 페이지 녹음 삭제 완료`);

      return { recordings: updated };
    }),

  // 모든 녹음 초기화
  clearAllRecordings: () => {
    console.log("🧼 모든 녹음 기록 초기화");
    set({ recordings: {} });
  },

  // 전체 녹음 상태 출력 (디버깅용)
  printAllRecordings: () => {
    const recordings = get().recordings;
    console.log("📂 전체 녹음 데이터:", recordings);
  }
}));

export default useRecordingsStore;
