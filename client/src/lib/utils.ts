import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "";
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  
  const formatter = new Intl.DateTimeFormat('en', { 
    month: 'short', 
    year: 'numeric'
  });
  
  return formatter.format(date);
}

export const calculateAtsDashOffset = (score: number): number => {
  // Circle has a circumference of 264 (2 * pi * r where r is 42)
  // We calculate how much of the circle to "hide" based on the score
  const circumference = 264;
  const dashOffset = circumference - (circumference * score / 100);
  return dashOffset;
};

export const getAtsScoreColor = (score: number): string => {
  if (score >= 80) return '#107C10'; // Success green
  if (score >= 60) return '#FFAA44'; // Warning yellow/orange
  return '#A80000'; // Error red
};

export const getAtsScoreText = (score: number): string => {
  if (score >= 80) return 'ATS-Friendly Resume';
  if (score >= 60) return 'Needs Improvement';
  return 'Not ATS-Optimized';
};

export const getAtsScoreDescription = (score: number): string => {
  if (score >= 80) return 'Your resume is optimized for Applicant Tracking Systems';
  if (score >= 60) return 'Make a few improvements to better match ATS requirements';
  return 'Update your resume to pass ATS screening';
};

// Generate a unique ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
};
