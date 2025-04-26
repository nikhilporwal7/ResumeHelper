import { useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import { useResumeContext } from "@/context/ResumeContext";
import { ResumePreview } from "@/components/ResumePreview";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Edit, Share2, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generatePDF } from "@/lib/pdf-generator";

export default function ResumeView() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { resumeData, loadResume } = useResumeContext();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load resume by ID
  useEffect(() => {
    const fetchResume = async () => {
      if (!id) {
        setError("No resume ID provided");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        await loadResume(parseInt(id));
        setIsLoading(false);
      } catch (error) {
        setError("Failed to load resume. It may have been deleted or you don't have permission to view it.");
        setIsLoading(false);
      }
    };

    fetchResume();
  }, [id]);

  // Handle resume download
  const handleDownload = async () => {
    try {
      await generatePDF(resumeData);
      toast({
        title: "Resume downloaded",
        description: "The resume has been downloaded as a PDF."
      });
    } catch (error) {
      toast({
        title: "Error downloading resume",
        description: "There was an error generating the PDF. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Handle edit resume
  const handleEditResume = () => {
    navigate(`/builder/${id}`);
  };

  // Handle copy link
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied",
        description: "Resume link copied to clipboard."
      });
    } catch (error) {
      toast({
        title: "Error copying link",
        description: "There was an error copying the link to clipboard.",
        variant: "destructive"
      });
    }
  };

  // Handle share
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${resumeData.personalInfo.firstName} ${resumeData.personalInfo.lastName} - Resume`,
          text: 'Check out this professional resume',
          url: window.location.href
        });
      } else {
        await handleCopyLink();
      }
    } catch (error) {
      toast({
        title: "Error sharing resume",
        description: "There was an error sharing the resume. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800">Loading resume...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="rounded-full bg-red-100 p-3 w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Resume Not Found</h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <Button
                className="bg-primary hover:bg-primary/90 text-white"
                onClick={() => navigate("/builder")}
              >
                Create New Resume
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8 bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {resumeData.personalInfo.firstName} {resumeData.personalInfo.lastName}'s Resume
            </h1>
            <p className="text-gray-600">
              {resumeData.personalInfo.professionalTitle}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              className="flex items-center"
              onClick={handleEditResume}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Resume
            </Button>
            <Button
              variant="outline"
              className="flex items-center"
              onClick={handleCopyLink}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy Link
            </Button>
            <Button
              variant="outline"
              className="flex items-center"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button
              className="bg-primary hover:bg-primary/90 text-white flex items-center"
              onClick={handleDownload}
            >
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>
      </div>

      <ResumePreview
        resumeData={resumeData}
        onDownload={handleDownload}
      />

      <div className="mt-8 text-center">
        <p className="text-gray-600 mb-4">Want to create your own professional resume?</p>
        <Button
          className="bg-primary hover:bg-primary/90 text-white"
          onClick={() => navigate("/builder")}
        >
          Create Your Resume
        </Button>
      </div>
    </div>
  );
}
