import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  resumeSchema, 
  insertResumeSchema,
  insertPersonalInfoSchema,
  insertSummarySchema,
  insertExperienceSchema,
  insertEducationSchema,
  insertSkillsSchema
} from "@shared/schema";
import { ZodError } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // API Routes - prefix all routes with /api
  
  // Handle zod validation errors
  const validateRequest = (schema: any, data: any) => {
    try {
      return { data: schema.parse(data), error: null };
    } catch (error) {
      if (error instanceof ZodError) {
        return { data: null, error: error.errors };
      }
      return { data: null, error: "Validation error" };
    }
  };

  // Get all resumes
  app.get("/api/resumes", async (req, res) => {
    try {
      const resumes = await storage.getResumes();
      res.json(resumes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch resumes" });
    }
  });

  // Get a single resume by ID with all its data
  app.get("/api/resumes/:id", async (req, res) => {
    try {
      const resumeId = parseInt(req.params.id);
      const resume = await storage.getCompleteResume(resumeId);
      
      if (!resume) {
        return res.status(404).json({ message: "Resume not found" });
      }
      
      res.json(resume);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch resume" });
    }
  });

  // Create a new resume
  app.post("/api/resumes", async (req, res) => {
    try {
      const { data, error } = validateRequest(resumeSchema, req.body);
      
      if (error) {
        return res.status(400).json({ message: "Invalid resume data", errors: error });
      }
      
      const savedResume = await storage.saveCompleteResume(data);
      res.status(201).json(savedResume);
    } catch (error) {
      res.status(500).json({ message: "Failed to create resume" });
    }
  });

  // Update an existing resume
  app.put("/api/resumes/:id", async (req, res) => {
    try {
      const resumeId = parseInt(req.params.id);
      const existingResume = await storage.getResume(resumeId);
      
      if (!existingResume) {
        return res.status(404).json({ message: "Resume not found" });
      }
      
      const { data, error } = validateRequest(resumeSchema, req.body);
      
      if (error) {
        return res.status(400).json({ message: "Invalid resume data", errors: error });
      }
      
      // Ensure the ID in the body matches the ID in the URL
      data.id = resumeId;
      
      const updatedResume = await storage.saveCompleteResume(data);
      res.json(updatedResume);
    } catch (error) {
      res.status(500).json({ message: "Failed to update resume" });
    }
  });

  // Delete a resume
  app.delete("/api/resumes/:id", async (req, res) => {
    try {
      const resumeId = parseInt(req.params.id);
      const deleted = await storage.deleteResume(resumeId);
      
      if (!deleted) {
        return res.status(404).json({ message: "Resume not found" });
      }
      
      res.json({ message: "Resume deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete resume" });
    }
  });

  // Calculate ATS score for a resume
  app.post("/api/resumes/:id/ats-score", async (req, res) => {
    try {
      const resumeId = parseInt(req.params.id);
      const resume = await storage.getCompleteResume(resumeId);
      
      if (!resume) {
        return res.status(404).json({ message: "Resume not found" });
      }
      
      // Simple ATS scoring algorithm
      let score = 0;
      
      // Check for professional title match with job description keywords
      if (resume.personalInfo.professionalTitle.length > 0) {
        score += 10;
      }
      
      // Check for email and contact info
      if (resume.personalInfo.email && resume.personalInfo.phone) {
        score += 10;
      }
      
      // Check for summary
      if (resume.summary.summary.length > 50) {
        score += 15;
      }
      
      // Check for work experience with bullet points
      if (resume.experience.length > 0) {
        score += 10;
        
        // Add points for detailed experience entries
        for (const exp of resume.experience) {
          if (exp.bulletPoints.length >= 3) {
            score += 5;
          }
        }
        
        // Cap experience points at 25
        score = Math.min(score, 25);
      }
      
      // Check for education
      if (resume.education.length > 0) {
        score += 10;
      }
      
      // Check for skills
      if (resume.skills.skills.length > 0) {
        score += 10;
        
        // Add points for more skills
        if (resume.skills.skills.length >= 5) {
          score += 5;
        }
        
        // Cap skills points at 20
        score = Math.min(score, 20);
      }
      
      // LinkedIn and portfolio bonuses
      if (resume.personalInfo.linkedin) {
        score += 5;
      }
      
      if (resume.personalInfo.portfolio) {
        score += 5;
      }
      
      // Ensure score is between 0 and 100
      score = Math.max(0, Math.min(100, score));
      
      // Update the resume with the new ATS score
      await storage.updateResume(resumeId, {
        atsScore: score
      });
      
      res.json({ score });
    } catch (error) {
      res.status(500).json({ message: "Failed to calculate ATS score" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
