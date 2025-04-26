import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useResumeContext } from "@/context/ResumeContext";
import { SectionType, ResumeSections } from "@/components/ResumeSections";
import { FormStepper } from "@/components/FormStepper";
import { ResumePreview } from "@/components/ResumePreview";
import { ATSScore, ATSTips } from "@/components/ATSScore";
import { ResumeTemplates, TemplateType } from "@/components/ResumeTemplates";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Download, Share2 } from "lucide-react";
import { generateAtsTips } from "@/lib/ats-analyzer";
import { generatePDF } from "@/lib/pdf-generator";

// Resume Form Components
import PersonalInfoForm from "@/components/resume-forms/PersonalInfoForm";
import SummaryForm from "@/components/resume-forms/SummaryForm";
import ExperienceForm from "@/components/resume-forms/ExperienceForm";
import EducationForm from "@/components/resume-forms/EducationForm";
import SkillsForm from "@/components/resume-forms/SkillsForm";

export default function ResumeBuilder() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { resumeData, setResumeData, loadResume, updateATSScore, saveResume } = useResumeContext();
  const { toast } = useToast();
  
  const [activeSection, setActiveSection] = useState<SectionType>('personal-info');
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [atsTips, setAtsTips] = useState<Array<{ type: 'success' | 'info', text: string }>>([]);
  
  // Sections for the stepper
  const resumeSections = [
    { id: 'personal-info', label: 'Personal Info' },
    { id: 'summary', label: 'Summary' },
    { id: 'experience', label: 'Experience' },
    { id: 'education', label: 'Education' },
    { id: 'skills', label: 'Skills' }
  ] as const;

  // Map steps to sections
  useEffect(() => {
    setActiveSection(resumeSections[currentStep].id);
  }, [currentStep]);

  // Load resume if ID is provided
  useEffect(() => {
    const fetchResume = async () => {
      if (id) {
        try {
          setIsLoading(true);
          await loadResume(parseInt(id));
          await updateATSScore();
          toast({
            title: "Resume loaded successfully",
            description: "You can now edit your resume."
          });
        } catch (error) {
          toast({
            title: "Error loading resume",
            description: "There was an error loading your resume.",
            variant: "destructive"
          });
          navigate("/builder");
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchResume();
  }, [id]);

  // Update ATS tips when resume data changes
  useEffect(() => {
    setAtsTips(generateAtsTips(resumeData));
  }, [resumeData]);

  // Handle template selection
  const handleTemplateChange = (template: TemplateType) => {
    setResumeData({
      ...resumeData,
      template
    });
  };

  // Handle resume download
  const handleDownload = async () => {
    try {
      await generatePDF(resumeData);
      toast({
        title: "Resume downloaded",
        description: "Your resume has been downloaded as a PDF."
      });
    } catch (error) {
      toast({
        title: "Error downloading resume",
        description: "There was an error generating the PDF. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Handle sharing resume
  const handleShare = async () => {
    try {
      // First ensure the resume is saved
      const savedResume = await saveResume();
      
      // Create a shareable link
      const shareUrl = `${window.location.origin}/view/${savedResume.id}`;
      
      // Try to use the Web Share API if available
      if (navigator.share) {
        await navigator.share({
          title: `${resumeData.personalInfo.firstName} ${resumeData.personalInfo.lastName} - Resume`,
          text: 'Check out my professional resume',
          url: shareUrl
        });
      } else {
        // Fallback to copying to clipboard
        await navigator.clipboard.writeText(shareUrl);
        toast({
          title: "Link copied to clipboard",
          description: "Share this link to your resume with others."
        });
      }
    } catch (error) {
      toast({
        title: "Error sharing resume",
        description: "There was an error sharing your resume. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Render the appropriate form based on the active section
  const renderForm = () => {
    switch (activeSection) {
      case 'personal-info':
        return <PersonalInfoForm onNext={() => setCurrentStep(1)} />;
      case 'summary':
        return <SummaryForm onNext={() => setCurrentStep(2)} onBack={() => setCurrentStep(0)} />;
      case 'experience':
        return <ExperienceForm onNext={() => setCurrentStep(3)} onBack={() => setCurrentStep(1)} />;
      case 'education':
        return <EducationForm onNext={() => setCurrentStep(4)} onBack={() => setCurrentStep(2)} />;
      case 'skills':
        return <SkillsForm onBack={() => setCurrentStep(3)} />;
      default:
        return <PersonalInfoForm onNext={() => setCurrentStep(1)} />;
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800">Loading your resume...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-1/4">
          <div className="bg-white rounded-lg shadow-md mb-6 p-6">
            {/* ATS Score */}
            <ATSScore score={resumeData.atsScore || 0} />

            {/* Resume Sections */}
            <ResumeSections 
              activeSection={activeSection} 
              onSectionChange={(section) => {
                setActiveSection(section);
                setCurrentStep(resumeSections.findIndex(s => s.id === section));
              }} 
            />

            {/* Templates */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <ResumeTemplates 
                selectedTemplate={resumeData.template as TemplateType || "professional"} 
                onSelectTemplate={handleTemplateChange}
              />
            </div>

            {/* Action Buttons */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <Button 
                className="w-full bg-primary hover:bg-primary/90 text-white py-2 px-4 rounded-md transition duration-150 ease-in-out mb-3"
                onClick={handleDownload}
              >
                <Download className="h-4 w-4 mr-2" /> Download PDF
              </Button>
              <Button 
                className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 py-2 px-4 rounded-md transition duration-150 ease-in-out"
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4 mr-2" /> Share Resume
              </Button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="w-full md:w-3/4">
          {/* Form Navigation */}
          <FormStepper 
            currentStep={currentStep} 
            setCurrentStep={setCurrentStep} 
            resumeSections={resumeSections}
          />

          {/* Form Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6" id={activeSection}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">{resumeSections[currentStep].label}</h2>
              <div className="flex items-center text-sm text-[#107C10]">
                <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>ATS Optimized</span>
              </div>
            </div>

            {/* Render the appropriate form */}
            {renderForm()}

            {/* ATS Tips */}
            <ATSTips tips={atsTips} />
          </div>

          {/* Resume Preview */}
          <ResumePreview 
            resumeData={resumeData}
            onDownload={handleDownload}
          />
        </main>
      </div>
    </div>
  );
}
