"use client";

import { AnalysisTaskCard } from "@/components/analysis-task-card";
import { useAnalysisQueueStore } from "@/stores/analyze";

export const AnalysisQueue = () => {
  const { queuedAnalysisIds } = useAnalysisQueueStore();

  if (queuedAnalysisIds.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-2 text-muted-foreground">
        <p className="font-medium">No active analyses</p>
        <p className="text-sm">Submitted code analyses will appear here</p>
      </div>
    );
  }

  return (
    <ul className="grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-2 xl:gap-x-8">
      {[...queuedAnalysisIds].reverse().map((analysisId) => (
        <AnalysisTaskCard key={analysisId} analysisId={analysisId} />
      ))}
    </ul>
  );
};
