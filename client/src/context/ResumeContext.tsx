import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { ResumeData, resumeSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { analyzeResume } from "@/lib/ats-analyzer";

// Default empty resume data
const defaultResumeData: ResumeData = {
  title: "My Resume",
  template: "professional",
  atsScore: 0,
  personalInfo: {
    firstName: "",
    lastName: "",
    professionalTitle: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    portfolio: ""
  },
  summary: {
    summary: ""
  },
  experience: [{
    jobTitle: "",
    company: "",
    location: "",
    startDate: "",
    endDate: "",
    isCurrentJob: false,
    description: "",
    bulletPoints: []
  }],
  education: [{
    degree: "",
    institution: "",
    location: "",
    startDate: "",
    endDate: "",
    isCurrentEducation: false,
    description: "",
    gpa: ""
  }],
  skills: {
    skills: []
  }
};

interface ResumeContextType {
  resumeData: ResumeData;
  setResumeData: (data: ResumeData) => void;
  saveResume: () => Promise<ResumeData>;
  loadResume: (id: number) => Promise<void>;
  createNewResume: () => void;
  updateATSScore: () => Promise<number>;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

interface ResumeProviderProps {
  children: ReactNode;
}

export const ResumeProvider = ({ children }: ResumeProviderProps) => {
  const [resumeData, setResumeData] = useState<ResumeData>(defaultResumeData);

  // Create a new empty resume
  const createNewResume = () => {
    setResumeData(defaultResumeData);
  };

  // Save resume to the server
  const saveResume = async (): Promise<ResumeData> => {
    try {
      const validatedData = resumeSchema.parse(resumeData);
      
      // If the resume has an ID, update it, otherwise create a new one
      if (validatedData.id) {
        const response = await apiRequest('PUT', `/api/resumes/${validatedData.id}`, validatedData);
        const savedResume = await response.json();
        setResumeData(savedResume);
        return savedResume;
      } else {
        const response = await apiRequest('POST', '/api/resumes', validatedData);
        const newResume = await response.json();
        setResumeData(newResume);
        return newResume;
      }
    } catch (error) {
      console.error('Error saving resume:', error);
      throw error;
    }
  };

  // Load resume from the server by ID
  const loadResume = async (id: number): Promise<void> => {
    try {
      const response = await fetch(`/api/resumes/${id}`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`Failed to load resume: ${response.status}`);
      }
      
      const loadedResume = await response.json();
      setResumeData(loadedResume);
    } catch (error) {
      console.error('Error loading resume:', error);
      throw error;
    }
  };

  // Update the ATS score
  const updateATSScore = async (): Promise<number> => {
    try {
      const score = await analyzeResume(resumeData);
      setResumeData(prev => ({
        ...prev,
        atsScore: score
      }));
      return score;
    } catch (error) {
      console.error('Error updating ATS score:', error);
      throw error;
    }
  };

  return (
    <ResumeContext.Provider value={{
      resumeData,
      setResumeData,
      saveResume,
      loadResume,
      createNewResume,
      updateATSScore
    }}>
      {children}
    </ResumeContext.Provider>
  );
};

// Custom hook for using the resume context
export const useResumeContext = () => {
  const context = useContext(ResumeContext);
  if (context === undefined) {
    throw new Error('useResumeContext must be used within a ResumeProvider');
  }
  return context;
};
