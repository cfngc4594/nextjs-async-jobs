"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { CodeAnalysis } from "@/generated/prisma";

export const submitCodeAnalysis = async (
  sourceCode: string
): Promise<string> => {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error(
      "Authentication required: Please log in to submit code for analysis"
    );
  }

  const newAnalysis = await prisma.codeAnalysis.create({
    data: {
      sourceCode: sourceCode,
      status: "PENDING",
      userId: session.user.id,
    },
  });

  const executeAnalysisPipeline = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await prisma.codeAnalysis.update({
        where: { id: newAnalysis.id },
        data: { status: "QUEUED" },
      });

      await new Promise((resolve) => setTimeout(resolve, 2000));
      await prisma.codeAnalysis.update({
        where: { id: newAnalysis.id },
        data: { status: "PROCESSING" },
      });

      await new Promise((resolve) => setTimeout(resolve, 2000));
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await prisma.codeAnalysis.update({
        where: { id: newAnalysis.id },
        data: { status: "COMPLETED", language: "C", timeComplexity: "O_1", spaceComplexity: "O_N" },
      });
    } catch (error) {
      await prisma.codeAnalysis.update({
        where: { id: newAnalysis.id },
        data: { status: "FAILED" },
      });
      throw error;
    }
  };

  executeAnalysisPipeline();

  return newAnalysis.id;
};

export const getAnalysisById = async (
  analysisId: string
): Promise<CodeAnalysis> => {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error(
      "Authentication required: Please log in to submit code for analysis"
    );
  }

  const analysis = await prisma.codeAnalysis.findUnique({
    where: { id: analysisId },
  });

  if (!analysis) {
    throw new Error("Analysis not found");
  }

  return analysis;
};
