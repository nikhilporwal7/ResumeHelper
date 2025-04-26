import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertEducationSchema } from "@shared/schema";
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
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ArrowRight, ArrowLeft, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Define the form schema
const educationFormSchema = z.object({
  educations: z.array(
    insertEducationSchema.extend({
      degree: z.string().min(1, "Degree is required"),
      institution: z.string().min(1, "Institution is required"),
      startDate: z.string().min(1, "Start date is required"),
      isCurrentEducation: z.boolean().default(false),
    })
  ),
});

interface EducationFormProps {
  onNext: () => void;
  onBack: () => void;
}

export default function EducationForm({ onNext, onBack }: EducationFormProps) {
  const { resumeData, setResumeData, updateATSScore } = useResumeContext();
  const { toast } = useToast();

  // Initialize form with existing data
  const form = useForm<z.infer<typeof educationFormSchema>>({
    resolver: zodResolver(educationFormSchema),
    defaultValues: {
      educations: resumeData.education.length > 0
        ? resumeData.education
        : [
            {
              degree: "",
              institution: "",
              location: "",
              startDate: "",
              endDate: "",
              isCurrentEducation: false,
              description: "",
              gpa: "",
            },
          ],
    },
  });

  // Use field array for managing multiple education entries
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "educations",
  });

  // Handler for form submission
  const onSubmit = async (data: z.infer<typeof educationFormSchema>) => {
    try {
      // Update resume data with form values
      setResumeData({
        ...resumeData,
        education: data.educations,
      });

      // Update ATS score
      await updateATSScore();
      
      // Move to next section
      onNext();
    } catch (error) {
      console.error("Error updating education:", error);
      toast({
        title: "Error",
        description: "There was an error saving your education information.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {fields.map((field, index) => (
          <Card key={field.id} className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg flex justify-between">
                <span>Education {index + 1}</span>
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => remove(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name={`educations.${index}.degree`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Degree</FormLabel>
                      <FormControl>
                        <Input placeholder="Bachelor of Science in Computer Science" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`educations.${index}.institution`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Institution</FormLabel>
                      <FormControl>
                        <Input placeholder="University of Washington" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`educations.${index}.location`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="Seattle, WA" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`educations.${index}.gpa`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>GPA</FormLabel>
                      <FormControl>
                        <Input placeholder="3.8/4.0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`educations.${index}.startDate`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Input type="month" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`educations.${index}.isCurrentEducation`}
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between space-x-2">
                      <FormLabel>Currently Studying</FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                {!form.watch(`educations.${index}.isCurrentEducation`) && (
                  <FormField
                    control={form.control}
                    name={`educations.${index}.endDate`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Date</FormLabel>
                        <FormControl>
                          <Input type="month" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              <FormField
                control={form.control}
                name={`educations.${index}.description`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormDescription>
                      Add relevant coursework, thesis, research, or notable achievements.
                    </FormDescription>
                    <FormControl>
                      <Textarea
                        placeholder="Relevant coursework: Data Structures, Algorithms, Machine Learning"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={() =>
            append({
              degree: "",
              institution: "",
              location: "",
              startDate: "",
              endDate: "",
              isCurrentEducation: false,
              description: "",
              gpa: "",
            })
          }
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Another Education
        </Button>

        <div className="flex justify-between mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="py-2 px-4 rounded-md transition duration-150 ease-in-out"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back: Work Experience
          </Button>
          <Button
            type="submit"
            className="bg-primary hover:bg-primary/90 text-white py-2 px-4 rounded-md transition duration-150 ease-in-out"
          >
            Next: Skills
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </form>
    </Form>
  );
}
