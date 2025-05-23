import { create } from "zustand";

type AnalysisQueueState = {
  queuedAnalysisIds: string[];
};

type AnalysisQueueActions = {
  queueAnalysis: (analysisId: string) => void;
};

type AnalysisQueueStore = AnalysisQueueState & AnalysisQueueActions;

export const useAnalysisQueueStore = create<AnalysisQueueStore>((set) => ({
  queuedAnalysisIds: [],
  queueAnalysis: (analysisId) =>
    set((state) => ({
      queuedAnalysisIds: [analysisId, ...state.queuedAnalysisIds],
    })),
}));
