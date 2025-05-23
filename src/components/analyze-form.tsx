"use client";

import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAnalysisQueueStore } from "@/stores/analyze";
import { submitCodeAnalysis } from "@/app/actions/analyze";

const formSchema = z.object({
  sourceCode: z.string().min(1, {
    message: "Please provide source code to analyze",
  }),
});

export const CodeAnalysisForm = () => {
  const { queueAnalysis } = useAnalysisQueueStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sourceCode: "",
    },
  });

  const submitForAnalysis = useCallback(
    (sourceCode: string) => {
      submitCodeAnalysis(sourceCode)
        .then((analysisId) => {
          queueAnalysis(analysisId);
          form.reset();
          toast.success("Analysis Started", {
            description:
              "Your code has been queued for analysis. Results will be available shortly.",
          });
        })
        .catch((error) => {
          toast.error("Analysis Failed", {
            description:
              error.message ||
              "Could not process your code. Please try again.",
          });
        });
    },
    [form, queueAnalysis]
  );

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    submitForAnalysis(values.sourceCode);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="sourceCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Source Code</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Paste your source code for quality and complexity analysis..."
                  {...field}
                  className="min-h-[240px]"
                />
              </FormControl>
              <FormDescription>
                The analysis will evaluate code quality metrics, identify
                optimization opportunities, and detect potential bugs and
                anti-patterns.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" variant="outline" className="w-full">
          Analyze Code
        </Button>
      </form>
    </Form>
  );
};
