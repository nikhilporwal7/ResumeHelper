import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertSummarySchema } from "@shared/schema";
import { useResumeContext } from "@/context/ResumeContext";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Extend schema with validation
const summarySchema = insertSummarySchema.extend({
  summary: z.string().min(50, "Professional summary should be at least 50 characters long to be ATS-friendly"),
});

interface SummaryFormProps {
  onNext: () => void;
  onBack: () => void;
}

export default function SummaryForm({ onNext, onBack }: SummaryFormProps) {
  const { resumeData, setResumeData, updateATSScore } = useResumeContext();
  const { toast } = useToast();

  // Initialize form with existing data
  const form = useForm<z.infer<typeof summarySchema>>({
    resolver: zodResolver(summarySchema),
    defaultValues: {
      summary: resumeData.summary.summary || "",
    },
  });

  // Handler for form submission
  const onSubmit = async (data: z.infer<typeof summarySchema>) => {
    try {
      // Update resume data with form values
      setResumeData({
        ...resumeData,
        summary: {
          summary: data.summary,
        },
      });

      // Update ATS score
      await updateATSScore();
      
      // Move to next section
      onNext();
    } catch (error) {
      console.error("Error updating summary:", error);
      toast({
        title: "Error",
        description: "There was an error saving your professional summary.",
        variant: "destructive",
      });
    }
  };

  const characterCount = form.watch("summary").length;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="summary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Professional Summary</FormLabel>
              <FormDescription>
                Provide a concise overview of your skills, experience, and key accomplishments. This is one of the first sections recruiters will read.
              </FormDescription>
              <FormControl>
                <Textarea 
                  placeholder="Experienced Software Engineer with over 5 years of expertise in developing web applications using JavaScript, React, and Node.js. Proven track record of delivering high-quality code and improving application performance by up to 40%." 
                  className="min-h-[150px]"
                  {...field} 
                />
              </FormControl>
              <div className="flex justify-between text-sm text-gray-500">
                <FormMessage />
                <span className={characterCount < 50 ? "text-red-500" : "text-green-600"}>
                  {characterCount}/200 characters
                </span>
              </div>
              {characterCount >= 50 && (
                <p className="text-sm text-[#107C10]">
                  <svg className="h-4 w-4 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Good summary length for ATS optimization
                </p>
              )}
            </FormItem>
          )}
        />

        <div className="flex justify-between mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="py-2 px-4 rounded-md transition duration-150 ease-in-out"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back: Personal Information
          </Button>
          <Button
            type="submit"
            className="bg-primary hover:bg-primary/90 text-white py-2 px-4 rounded-md transition duration-150 ease-in-out"
          >
            Next: Work Experience
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </form>
    </Form>
  );
}
