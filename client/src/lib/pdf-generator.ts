import { ResumeData } from "@shared/schema";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

export const generatePDF = async (resumeData: ResumeData): Promise<void> => {
  // Get the resume content element
  const resumeElement = document.getElementById('resume-content');
  
  if (!resumeElement) {
    throw new Error('Resume content element not found');
  }

  try {
    // Create a canvas from the resume element
    const canvas = await html2canvas(resumeElement, {
      scale: 2, // Increase quality
      useCORS: true,
      logging: false,
      allowTaint: true,
    });

    // Calculate PDF dimensions (A4 format)
    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // Create a new PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // Add the image to the PDF
    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

    // Save the PDF with a filename based on the resume data
    const fileName = `${resumeData.personalInfo.firstName}_${resumeData.personalInfo.lastName}_Resume.pdf`;
    pdf.save(fileName);
    
    return;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF');
  }
};

// Polyfill for importing jsPDF and html2canvas
// This is a workaround since we can't actually import these libraries
// In a real implementation, these would be actual imports
declare global {
  interface Window {
    jspdf: any;
    html2canvas: any;
  }
}

// Mock implementation for the PDF generation without the actual libraries
const mockGeneratePDF = async (resumeData: ResumeData): Promise<void> => {
  console.log('Generating PDF for', resumeData.personalInfo.firstName, resumeData.personalInfo.lastName);
  
  // Simulate a delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In a real implementation, this would create and download a PDF
  // For now, we'll just create a fake download
  const link = document.createElement('a');
  link.download = `${resumeData.personalInfo.firstName}_${resumeData.personalInfo.lastName}_Resume.pdf`;
  link.href = 'data:application/pdf;charset=utf-8,'; // Empty PDF data
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Use the mock implementation if the real libraries aren't available
// In production, you would use the actual implementation with proper imports
export { mockGeneratePDF };
