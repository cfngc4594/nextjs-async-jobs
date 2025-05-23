import { AnalysisQueue } from "@/components/analysis-queue";
import { CodeAnalysisForm } from "@/components/analyze-form";

export default function AnalyzePage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8 md:gap-12">
        <div className="w-full md:w-1/3 md:sticky md:top-8 md:self-start">
          <h1 className="text-3xl md:text-4xl mb-6 md:mb-8">
            Get Instant Code Insights
          </h1>
          <p className="text-md max-w-md mb-6 md:mb-8">
            Submit your code for comprehensive quality and performance
            evaluation
          </p>
          <CodeAnalysisForm />
        </div>
        <div className="w-full md:w-2/3 mt-8 md:mt-0">
          <AnalysisQueue />
        </div>
      </div>
    </main>
  );
}
