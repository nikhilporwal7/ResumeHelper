import { Link, useLocation } from "wouter";
import MsLogo from "./ms-logo";
import { Button } from "@/components/ui/button";
import { Save, Download, Database } from "lucide-react";
import { useResumeContext } from "@/context/ResumeContext";
import { apiRequest } from "@/lib/queryClient";
import { generatePDF } from "@/lib/pdf-generator";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";

export default function Header() {
  const [location] = useLocation();
  const { resumeData, saveResume } = useResumeContext();
  const { toast } = useToast();

  const isResumeEditor = location.startsWith('/builder');
  
  const handleSave = async () => {
    if (!resumeData) return;

    try {
      await saveResume();
      toast({
        title: "Resume saved",
        description: "Your resume has been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error saving resume",
        description: "There was an error saving your resume. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = async () => {
    if (!resumeData) return;

    try {
      await generatePDF(resumeData);
      toast({
        title: "Resume downloaded",
        description: "Your resume has been downloaded as a PDF.",
      });
    } catch (error) {
      toast({
        title: "Error downloading resume",
        description: "There was an error generating the PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <header className="bg-white border-b border-[#D2D0CE]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/">
              <div className="flex-shrink-0 flex items-center cursor-pointer">
                <MsLogo className="h-8 w-8 text-primary" />
                <div className="ml-3">
                  <h1 className="text-xl font-semibold text-gray-800">Resume Builder</h1>
                  <p className="text-sm text-gray-700">ATS-Optimized Templates</p>
                </div>
              </div>
            </Link>
            <nav className="ml-8">
              <ul className="flex space-x-8">
                <li>
                  <Link href="/">
                    <a className={`text-gray-700 hover:text-primary ${location === '/' ? 'text-primary font-medium' : ''}`}>
                      Home
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/builder">
                    <a className={`text-gray-700 hover:text-primary ${location.startsWith('/builder') ? 'text-primary font-medium' : ''}`}>
                      Create Resume
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/arweave">
                    <a className={`text-gray-700 hover:text-primary flex items-center ${location === '/arweave' ? 'text-primary font-medium' : ''}`}>
                      <Database className="h-4 w-4 mr-1" />
                      Arweave Storage
                    </a>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
          {isResumeEditor && resumeData && (
            <div className="flex items-center">
              <Button 
                className="bg-primary hover:bg-primary/90 text-white py-2 px-4 rounded-md transition duration-150 ease-in-out mr-2"
                onClick={handleSave}
              >
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button 
                className="bg-gray-800 hover:bg-gray-900 text-white py-2 px-4 rounded-md transition duration-150 ease-in-out"
                onClick={handleDownload}
              >
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
