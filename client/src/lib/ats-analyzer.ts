import { ResumeData } from "@shared/schema";
import { apiRequest } from "./queryClient";

// Function to analyze a resume for ATS optimization
export const analyzeResume = async (resumeData: ResumeData): Promise<number> => {
  try {
    // If the resume has an ID, use the server-side ATS scoring
    if (resumeData.id) {
      const response = await apiRequest('POST', `/api/resumes/${resumeData.id}/ats-score`, null);
      const data = await response.json();
      return data.score;
    } else {
      // Otherwise, calculate a client-side score
      return calculateAtsScore(resumeData);
    }
  } catch (error) {
    console.error('Error analyzing resume:', error);
    return calculateAtsScore(resumeData); // Fallback to client-side scoring
  }
};

// Client-side implementation of the ATS scoring algorithm
const calculateAtsScore = (resumeData: ResumeData): number => {
  let score = 0;
  
  // Check for professional title match
  if (resumeData.personalInfo.professionalTitle.length > 0) {
    score += 10;
  }
  
  // Check for email and contact info
  if (resumeData.personalInfo.email && resumeData.personalInfo.phone) {
    score += 10;
  }
  
  // Check for summary
  if (resumeData.summary.summary && resumeData.summary.summary.length > 50) {
    score += 15;
  }
  
  // Check for work experience with bullet points
  if (resumeData.experience && resumeData.experience.length > 0) {
    score += 10;
    
    // Add points for detailed experience entries
    for (const exp of resumeData.experience) {
      if (exp.bulletPoints && exp.bulletPoints.length >= 3) {
        score += 5;
      }
    }
    
    // Cap experience points at 25
    score = Math.min(score, 25);
  }
  
  // Check for education
  if (resumeData.education && resumeData.education.length > 0) {
    score += 10;
  }
  
  // Check for skills
  if (resumeData.skills.skills && resumeData.skills.skills.length > 0) {
    score += 10;
    
    // Add points for more skills
    if (resumeData.skills.skills.length >= 5) {
      score += 5;
    }
    
    // Cap skills points at 20
    score = Math.min(score, 20);
  }
  
  // LinkedIn and portfolio bonuses
  if (resumeData.personalInfo.linkedin) {
    score += 5;
  }
  
  if (resumeData.personalInfo.portfolio) {
    score += 5;
  }
  
  // Ensure score is between 0 and 100
  return Math.max(0, Math.min(100, score));
};

// Generate ATS improvement tips based on the resume data
export const generateAtsTips = (resumeData: ResumeData): Array<{ type: 'success' | 'info', text: string }> => {
  const tips: Array<{ type: 'success' | 'info', text: string }> = [];
  
  // Contact information tips
  if (resumeData.personalInfo.email && resumeData.personalInfo.email.includes('@')) {
    tips.push({ type: 'success', text: 'Use a professional email address with your name' });
  } else {
    tips.push({ type: 'info', text: 'Add a professional email address with your name' });
  }
  
  // Professional title tip
  if (resumeData.personalInfo.professionalTitle) {
    tips.push({ 
      type: 'success', 
      text: 'Make sure your job title matches the position you\'re applying for' 
    });
  } else {
    tips.push({ 
      type: 'info', 
      text: 'Include a professional title that matches the position you\'re applying for' 
    });
  }
  
  // LinkedIn tip
  if (resumeData.personalInfo.linkedin) {
    tips.push({ 
      type: 'success', 
      text: 'Include your LinkedIn profile to strengthen your online presence' 
    });
  } else {
    tips.push({ 
      type: 'info', 
      text: 'Include your LinkedIn profile to strengthen your online presence' 
    });
  }
  
  // Experience bullet points tip
  const experienceWithFewerThan3Bullets = resumeData.experience.some(
    exp => !exp.bulletPoints || exp.bulletPoints.length < 3
  );
  
  if (experienceWithFewerThan3Bullets) {
    tips.push({ 
      type: 'info', 
      text: 'Include at least 3 bullet points per work experience with quantifiable achievements' 
    });
  } else if (resumeData.experience.length > 0) {
    tips.push({ 
      type: 'success', 
      text: 'Work experience includes detailed bullet points with achievements' 
    });
  }
  
  // Skills tip
  if (!resumeData.skills.skills || resumeData.skills.skills.length < 5) {
    tips.push({ 
      type: 'info', 
      text: 'Add more relevant skills, including keywords from the job description' 
    });
  } else {
    tips.push({ 
      type: 'success', 
      text: 'Resume includes a good number of relevant skills' 
    });
  }
  
  return tips;
};
