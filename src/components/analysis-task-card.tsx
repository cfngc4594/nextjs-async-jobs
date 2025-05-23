"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import COriginal from "devicons-react/icons/COriginal";
import { getAnalysisById } from "@/app/actions/analyze";
import { useCallback, useEffect, useState } from "react";
import JavaOriginal from "devicons-react/icons/JavaOriginal";
import {
  AnalysisStatus,
  CodeAnalysis,
  Complexity,
  Language,
} from "@/generated/prisma";

interface AnalysisTaskCardProps {
  analysisId: string;
}

const ACTIVE_STATUSES: AnalysisStatus[] = ["PENDING", "QUEUED", "PROCESSING"];
const FINAL_STATUSES: AnalysisStatus[] = ["COMPLETED", "FAILED"];

const statusColorMap: Record<AnalysisStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80",
  QUEUED: "bg-blue-100 text-blue-800 hover:bg-blue-100/80",
  PROCESSING: "bg-purple-100 text-purple-800 hover:bg-purple-100/80",
  COMPLETED: "bg-green-100 text-green-800 hover:bg-green-100/80",
  FAILED: "bg-red-100 text-red-800 hover:bg-red-100/80",
};

const getIconForLanguage = (language: Language) => {
  switch (language) {
    case "C":
      return COriginal;
    case "JAVA":
      return JavaOriginal;
  }
};

const getLabelForLanguage = (language: Language) => {
  switch (language) {
    case "C":
      return "C";
    case "JAVA":
      return "JAVA";
  }
};

const getLabelForComplexity = (complexity: Complexity) => {
  switch (complexity) {
    case "O_1":
      return "O(1)";
    case "O_N":
      return "O(N)";
  }
};

export const AnalysisTaskCard = ({ analysisId }: AnalysisTaskCardProps) => {
  const [analysis, setAnalysis] = useState<CodeAnalysis | null>(null);

  const fetchAnalysis = useCallback(() => {
    getAnalysisById(analysisId)
      .then((analysis) => {
        setAnalysis(analysis);
      })
      .catch((error) => {
        toast.error("Analysis Update Failed", {
          description: error.message || "Failed to fetch analysis data.",
        });
      });
  }, [analysisId]);

  useEffect(() => {
    if (!analysis) {
      fetchAnalysis();
    }

    const interval = setInterval(() => {
      if (!analysis || ACTIVE_STATUSES.includes(analysis.status)) {
        fetchAnalysis();
      } else if (FINAL_STATUSES.includes(analysis.status)) {
        clearInterval(interval);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [analysis, analysisId, fetchAnalysis]);

  if (!analysis) return null;

  const Icon = analysis.language
    ? getIconForLanguage(analysis.language)
    : undefined;

  const label = analysis.language
    ? getLabelForLanguage(analysis.language)
    : undefined;

  const timeComplexity = analysis.timeComplexity
    ? getLabelForComplexity(analysis.timeComplexity)
    : undefined;

  const spaceComplexity = analysis.spaceComplexity
    ? getLabelForComplexity(analysis.spaceComplexity)
    : undefined;

  return (
    <Card className="overflow-hidden py-0 gap-0">
      <CardHeader className="flex items-center justify-between border-b p-6">
        <CardTitle>
          {Icon ? (
            <div className="h-12 w-12 rounded-lg border flex items-center justify-center">
              <Icon size={24} />
            </div>
          ) : (
            <Skeleton className="h-12 w-12 rounded-lg" />
          )}
        </CardTitle>
        <CardDescription>
          <Badge
            className={cn("h-6 rounded-lg", statusColorMap[analysis.status])}
          >
            {analysis?.status}
          </Badge>
        </CardDescription>
      </CardHeader>
      <CardContent className="-my-3 divide-y px-6 py-4 text-sm/6">
        <div className="flex justify-between gap-x-4 py-3">
          <dt>Language</dt>
          <dd>
            {label ? label : <Skeleton className="h-6 w-16 rounded-lg" />}
          </dd>
        </div>
        <div className="flex justify-between gap-x-4 py-3">
          <dt>Time Complexity</dt>
          <dd>
            {timeComplexity ? (
              timeComplexity
            ) : (
              <Skeleton className="h-6 w-16 rounded-lg" />
            )}
          </dd>
        </div>
        <div className="flex justify-between gap-x-4 py-3">
          <dt>Space Complexity</dt>
          <dd>
            {spaceComplexity ? (
              spaceComplexity
            ) : (
              <Skeleton className="h-6 w-16 rounded-lg" />
            )}
          </dd>
        </div>
        <div className="flex justify-between gap-x-4 py-3">
          <dt>Submit Time</dt>
          <dd>
            <time dateTime={analysis.createdAt.toISOString()}>
              {analysis.createdAt.toLocaleString()}
            </time>
          </dd>
        </div>
      </CardContent>
    </Card>
  );
};
