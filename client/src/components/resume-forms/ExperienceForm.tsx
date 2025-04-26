import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertExperienceSchema } from "@shared/schema";
import { useResumeContext } from "@/context/ResumeContext";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
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
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { ArrowRight, ArrowLeft, Plus, Trash2, Move } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Define the form schema based on the experience schema
const experienceFormSchema = z.object({
  experiences: z.array(
    insertExperienceSchema.extend({
      jobTitle: z.string().min(1, "Job title is required"),
      company: z.string().min(1, "Company name is required"),
      startDate: z.string().min(1, "Start date is required"),
      isCurrentJob: z.boolean().default(false),
      bulletPoints: z.array(z.string()),
    })
  ),
});

interface ExperienceFormProps {
  onNext: () => void;
  onBack: () => void;
}

export default function ExperienceForm({ onNext, onBack }: ExperienceFormProps) {
  const { resumeData, setResumeData, updateATSScore } = useResumeContext();
  const { toast } = useToast();
  const [newBulletPoint, setNewBulletPoint] = useState<string>("");
  const [activeBulletIndex, setActiveBulletIndex] = useState<number | null>(null);

  // Initialize form with existing data
  const form = useForm<z.infer<typeof experienceFormSchema>>({
    resolver: zodResolver(experienceFormSchema),
    defaultValues: {
      experiences: resumeData.experience.length > 0
        ? resumeData.experience
        : [
            {
              jobTitle: "",
              company: "",
              location: "",
              startDate: "",
              endDate: "",
              isCurrentJob: false,
              description: "",
              bulletPoints: [],
            },
          ],
    },
  });

  // Use field array for managing multiple experiences
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "experiences",
  });

  // Handler for form submission
  const onSubmit = async (data: z.infer<typeof experienceFormSchema>) => {
    try {
      // Update resume data with form values
      setResumeData({
        ...resumeData,
        experience: data.experiences,
      });

      // Update ATS score
      await updateATSScore();
      
      // Move to next section
      onNext();
    } catch (error) {
      console.error("Error updating experience:", error);
      toast({
        title: "Error",
        description: "There was an error saving your work experience.",
        variant: "destructive",
      });
    }
  };

  // Add a new bullet point to a specific experience
  const handleAddBulletPoint = (index: number) => {
    if (!newBulletPoint.trim()) return;
    
    const experiences = form.getValues().experiences;
    const updatedExperiences = [...experiences];
    
    if (!updatedExperiences[index].bulletPoints) {
      updatedExperiences[index].bulletPoints = [];
    }
    
    updatedExperiences[index].bulletPoints.push(newBulletPoint.trim());
    form.setValue("experiences", updatedExperiences);
    setNewBulletPoint("");
  };

  // Remove a bullet point from a specific experience
  const handleRemoveBulletPoint = (expIndex: number, bulletIndex: number) => {
    const experiences = form.getValues().experiences;
    const updatedExperiences = [...experiences];
    
    updatedExperiences[expIndex].bulletPoints = updatedExperiences[expIndex].bulletPoints.filter(
      (_, i) => i !== bulletIndex
    );
    
    form.setValue("experiences", updatedExperiences);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {fields.map((field, index) => (
          <Card key={field.id} className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg flex justify-between">
                <span>Work Experience {index + 1}</span>
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
                  name={`experiences.${index}.jobTitle`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Senior Software Engineer" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`experiences.${index}.company`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company</FormLabel>
                      <FormControl>
                        <Input placeholder="Microsoft" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`experiences.${index}.location`}
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
                  name={`experiences.${index}.startDate`}
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
                  name={`experiences.${index}.isCurrentJob`}
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between space-x-2">
                      <FormLabel>Current Position</FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                {!form.watch(`experiences.${index}.isCurrentJob`) && (
                  <FormField
                    control={form.control}
                    name={`experiences.${index}.endDate`}
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
                name={`experiences.${index}.description`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Brief description of your role and responsibilities"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Bullet Points */}
              <div>
                <FormLabel>Key Achievements (Bullet Points)</FormLabel>
                <ul className="mt-2 space-y-2">
                  {form.watch(`experiences.${index}.bulletPoints`)?.map((bullet, bulletIndex) => (
                    <li key={bulletIndex} className="flex items-center">
                      <div className="w-5 text-gray-500 mr-2">•</div>
                      <div className="flex-1">
                        {activeBulletIndex === bulletIndex ? (
                          <div className="flex items-center">
                            <Input
                              value={bullet}
                              onChange={(e) => {
                                const experiences = form.getValues().experiences;
                                const updatedExperiences = [...experiences];
                                updatedExperiences[index].bulletPoints[bulletIndex] = e.target.value;
                                form.setValue("experiences", updatedExperiences);
                              }}
                              className="flex-1"
                              autoFocus
                              onBlur={() => setActiveBulletIndex(null)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  setActiveBulletIndex(null);
                                }
                              }}
                            />
                          </div>
                        ) : (
                          <div 
                            className="py-2 cursor-pointer"
                            onClick={() => setActiveBulletIndex(bulletIndex)}
                          >
                            {bullet}
                          </div>
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveBulletPoint(index, bulletIndex)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </li>
                  ))}
                </ul>

                <div className="mt-4 flex items-center">
                  <Input
                    placeholder="Add achievement (e.g., 'Increased site performance by 40%')"
                    value={newBulletPoint}
                    onChange={(e) => setNewBulletPoint(e.target.value)}
                    className="flex-1"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && newBulletPoint.trim()) {
                        e.preventDefault();
                        handleAddBulletPoint(index);
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={() => handleAddBulletPoint(index)}
                    className="ml-2 bg-primary hover:bg-primary/90"
                    disabled={!newBulletPoint.trim()}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                {form.watch(`experiences.${index}.bulletPoints`)?.length < 3 && (
                  <p className="text-xs text-amber-600 mt-2">
                    <svg className="h-4 w-4 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    Add at least 3 bullet points for better ATS optimization
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={() =>
            append({
              jobTitle: "",
              company: "",
              location: "",
              startDate: "",
              endDate: "",
              isCurrentJob: false,
              description: "",
              bulletPoints: [],
            })
          }
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Another Work Experience
        </Button>

        <div className="flex justify-between mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="py-2 px-4 rounded-md transition duration-150 ease-in-out"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back: Professional Summary
          </Button>
          <Button
            type="submit"
            className="bg-primary hover:bg-primary/90 text-white py-2 px-4 rounded-md transition duration-150 ease-in-out"
          >
            Next: Education
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </form>
    </Form>
  );
}
