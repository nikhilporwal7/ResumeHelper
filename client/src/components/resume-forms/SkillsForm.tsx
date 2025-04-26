import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertSkillsSchema } from "@shared/schema";
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
import { Input } from "@/components/ui/input";
import { ArrowLeft, Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

// Define form schema
const skillsFormSchema = z.object({
  skills: z.array(z.string()),
});

interface SkillsFormProps {
  onBack: () => void;
}

export default function SkillsForm({ onBack }: SkillsFormProps) {
  const { resumeData, setResumeData, updateATSScore, saveResume } = useResumeContext();
  const { toast } = useToast();
  const [newSkill, setNewSkill] = useState("");

  // Initialize form with existing data
  const form = useForm<z.infer<typeof skillsFormSchema>>({
    resolver: zodResolver(skillsFormSchema),
    defaultValues: {
      skills: resumeData.skills.skills || [],
    },
  });

  // Handler for form submission
  const onSubmit = async (data: z.infer<typeof skillsFormSchema>) => {
    try {
      // Update resume data with form values
      setResumeData({
        ...resumeData,
        skills: {
          skills: data.skills,
        },
      });

      // Update ATS score
      await updateATSScore();
      
      // Save the complete resume
      await saveResume();
      
      toast({
        title: "Resume saved successfully",
        description: "Your resume has been updated with your skills and saved.",
      });
    } catch (error) {
      console.error("Error updating skills:", error);
      toast({
        title: "Error",
        description: "There was an error saving your skills.",
        variant: "destructive",
      });
    }
  };

  // Add a new skill
  const handleAddSkill = () => {
    if (!newSkill.trim()) return;
    
    const currentSkills = form.getValues().skills || [];
    
    // Prevent duplicates
    if (currentSkills.includes(newSkill.trim())) {
      toast({
        title: "Duplicate skill",
        description: "This skill is already in your list.",
        variant: "destructive",
      });
      return;
    }
    
    form.setValue("skills", [...currentSkills, newSkill.trim()]);
    setNewSkill("");
  };

  // Remove a skill
  const handleRemoveSkill = (skillToRemove: string) => {
    const currentSkills = form.getValues().skills;
    form.setValue(
      "skills",
      currentSkills.filter((skill) => skill !== skillToRemove)
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="skills"
          render={() => (
            <FormItem>
              <FormLabel>Skills</FormLabel>
              <FormDescription>
                Add your technical and soft skills relevant to the job you're applying for. 
                Include specific technologies, programming languages, and professional competencies.
              </FormDescription>
              
              <div className="flex items-center mb-4">
                <FormControl>
                  <Input
                    placeholder="Add a skill (e.g., JavaScript, Project Management)"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && newSkill.trim()) {
                        e.preventDefault();
                        handleAddSkill();
                      }
                    }}
                  />
                </FormControl>
                <Button
                  type="button"
                  onClick={handleAddSkill}
                  className="ml-2 bg-primary hover:bg-primary/90"
                  disabled={!newSkill.trim()}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Display added skills */}
              <div className="flex flex-wrap gap-2 mt-4">
                {form.watch("skills").map((skill, index) => (
                  <Badge 
                    key={index} 
                    className="bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="ml-1 rounded-full hover:bg-primary/30 p-1"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              
              {form.watch("skills").length < 5 && (
                <p className="text-xs text-amber-600 mt-2">
                  <svg className="h-4 w-4 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  Add at least 5 skills for better ATS optimization
                </p>
              )}
              
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Suggestions for popular skills */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Popular Skills</h3>
          <div className="flex flex-wrap gap-2">
            {[
              "JavaScript", "React", "Node.js", "Python", "SQL", 
              "Project Management", "Communication", "Leadership", 
              "TypeScript", "AWS", "Azure", "Docker", "Git"
            ].map((skill) => (
              <Badge
                key={skill}
                variant="outline"
                className="cursor-pointer hover:bg-primary/10"
                onClick={() => {
                  const currentSkills = form.getValues().skills || [];
                  if (!currentSkills.includes(skill)) {
                    form.setValue("skills", [...currentSkills, skill]);
                  }
                }}
              >
                + {skill}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="py-2 px-4 rounded-md transition duration-150 ease-in-out"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back: Education
          </Button>
          <Button
            type="submit"
            className="bg-primary hover:bg-primary/90 text-white py-2 px-4 rounded-md transition duration-150 ease-in-out"
          >
            Save Resume
          </Button>
        </div>
      </form>
    </Form>
  );
}
