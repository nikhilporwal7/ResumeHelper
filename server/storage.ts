import {
  users, type User, type InsertUser,
  type Resume, type InsertResume,
  type PersonalInfo, type InsertPersonalInfo,
  type Summary, type InsertSummary,
  type Experience, type InsertExperience,
  type Education, type InsertEducation,
  type Skills, type InsertSkills,
  type ResumeData
} from "@shared/schema";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Resume operations
  createResume(resume: InsertResume, userId?: number): Promise<Resume>;
  getResumes(userId?: number): Promise<Resume[]>;
  getResume(id: number): Promise<Resume | undefined>;
  updateResume(id: number, resume: Partial<InsertResume>): Promise<Resume | undefined>;
  deleteResume(id: number): Promise<boolean>;
  
  // Complete resume data operations
  getCompleteResume(resumeId: number): Promise<ResumeData | undefined>;
  saveCompleteResume(resumeData: ResumeData, userId?: number): Promise<ResumeData>;
  
  // Personal Info operations
  createPersonalInfo(personalInfo: InsertPersonalInfo, resumeId: number): Promise<PersonalInfo>;
  getPersonalInfo(resumeId: number): Promise<PersonalInfo | undefined>;
  updatePersonalInfo(id: number, personalInfo: Partial<InsertPersonalInfo>): Promise<PersonalInfo | undefined>;
  
  // Summary operations
  createSummary(summary: InsertSummary, resumeId: number): Promise<Summary>;
  getSummary(resumeId: number): Promise<Summary | undefined>;
  updateSummary(id: number, summary: Partial<InsertSummary>): Promise<Summary | undefined>;
  
  // Experience operations
  createExperience(experience: InsertExperience, resumeId: number): Promise<Experience>;
  getExperiences(resumeId: number): Promise<Experience[]>;
  getExperience(id: number): Promise<Experience | undefined>;
  updateExperience(id: number, experience: Partial<InsertExperience>): Promise<Experience | undefined>;
  deleteExperience(id: number): Promise<boolean>;
  
  // Education operations
  createEducation(education: InsertEducation, resumeId: number): Promise<Education>;
  getEducations(resumeId: number): Promise<Education[]>;
  getEducation(id: number): Promise<Education | undefined>;
  updateEducation(id: number, education: Partial<InsertEducation>): Promise<Education | undefined>;
  deleteEducation(id: number): Promise<boolean>;
  
  // Skills operations
  createSkills(skills: InsertSkills, resumeId: number): Promise<Skills>;
  getSkills(resumeId: number): Promise<Skills | undefined>;
  updateSkills(id: number, skills: Partial<InsertSkills>): Promise<Skills | undefined>;
}

import { db } from "./db";
import { 
  users, resumes, resumePersonalInfo, resumeSummary, 
  resumeExperience, resumeEducation, resumeSkills 
} from "@shared/schema";
import { eq } from "drizzle-orm";

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Resume operations
  async createResume(insertResume: InsertResume, userId?: number): Promise<Resume> {
    const now = new Date();
    const [resume] = await db
      .insert(resumes)
      .values({
        ...insertResume,
        userId: userId || null,
        createdAt: now,
        updatedAt: now
      })
      .returning();
    return resume;
  }

  async getResumes(userId?: number): Promise<Resume[]> {
    if (userId) {
      return db.select().from(resumes).where(eq(resumes.userId, userId));
    }
    return db.select().from(resumes);
  }

  async getResume(id: number): Promise<Resume | undefined> {
    const [resume] = await db.select().from(resumes).where(eq(resumes.id, id));
    return resume || undefined;
  }

  async updateResume(id: number, resume: Partial<InsertResume>): Promise<Resume | undefined> {
    const [updatedResume] = await db
      .update(resumes)
      .set({
        ...resume,
        updatedAt: new Date()
      })
      .where(eq(resumes.id, id))
      .returning();
    return updatedResume || undefined;
  }

  async deleteResume(id: number): Promise<boolean> {
    const result = await db.delete(resumes).where(eq(resumes.id, id));
    return !!result.count;
  }

  // Complete resume data operations
  async getCompleteResume(resumeId: number): Promise<ResumeData | undefined> {
    const resume = await this.getResume(resumeId);
    if (!resume) return undefined;
    
    const personalInfo = await this.getPersonalInfo(resumeId);
    const summary = await this.getSummary(resumeId);
    const experience = await this.getExperiences(resumeId);
    const education = await this.getEducations(resumeId);
    const skills = await this.getSkills(resumeId);
    
    if (!personalInfo || !summary || !skills) return undefined;
    
    return {
      id: resume.id,
      title: resume.title,
      template: resume.template,
      atsScore: resume.atsScore || 0,
      personalInfo: {
        firstName: personalInfo.firstName,
        lastName: personalInfo.lastName,
        professionalTitle: personalInfo.professionalTitle,
        email: personalInfo.email,
        phone: personalInfo.phone,
        location: personalInfo.location,
        linkedin: personalInfo.linkedin,
        portfolio: personalInfo.portfolio
      },
      summary: {
        summary: summary.summary
      },
      experience: experience.map(exp => ({
        jobTitle: exp.jobTitle,
        company: exp.company,
        location: exp.location,
        startDate: exp.startDate,
        endDate: exp.endDate,
        isCurrentJob: exp.isCurrentJob,
        description: exp.description,
        bulletPoints: exp.bulletPoints as string[] || []
      })),
      education: education.map(edu => ({
        degree: edu.degree,
        institution: edu.institution,
        location: edu.location,
        startDate: edu.startDate,
        endDate: edu.endDate,
        isCurrentEducation: edu.isCurrentEducation,
        description: edu.description,
        gpa: edu.gpa
      })),
      skills: {
        skills: skills.skills as string[] || []
      }
    };
  }

  async saveCompleteResume(resumeData: ResumeData, userId?: number): Promise<ResumeData> {
    let resumeId: number;
    
    // If resumeId exists, update, otherwise create new resume
    if (resumeData.id) {
      await this.updateResume(resumeData.id, {
        title: resumeData.title,
        template: resumeData.template,
        atsScore: resumeData.atsScore
      });
      resumeId = resumeData.id;
    } else {
      const newResume = await this.createResume({
        title: resumeData.title,
        template: resumeData.template,
        atsScore: resumeData.atsScore
      }, userId);
      resumeId = newResume.id;
    }
    
    // Check if personalInfo exists for this resume
    const existingPersonalInfo = await this.getPersonalInfo(resumeId);
    if (existingPersonalInfo) {
      await this.updatePersonalInfo(existingPersonalInfo.id, resumeData.personalInfo);
    } else {
      await this.createPersonalInfo(resumeData.personalInfo, resumeId);
    }
    
    // Check if summary exists for this resume
    const existingSummary = await this.getSummary(resumeId);
    if (existingSummary) {
      await this.updateSummary(existingSummary.id, resumeData.summary);
    } else {
      await this.createSummary(resumeData.summary, resumeId);
    }
    
    // Delete existing experiences and create new ones
    const existingExperiences = await this.getExperiences(resumeId);
    for (const exp of existingExperiences) {
      await this.deleteExperience(exp.id);
    }
    for (const exp of resumeData.experience) {
      await this.createExperience(exp, resumeId);
    }
    
    // Delete existing educations and create new ones
    const existingEducations = await this.getEducations(resumeId);
    for (const edu of existingEducations) {
      await this.deleteEducation(edu.id);
    }
    for (const edu of resumeData.education) {
      await this.createEducation(edu, resumeId);
    }
    
    // Check if skills exists for this resume
    const existingSkills = await this.getSkills(resumeId);
    if (existingSkills) {
      await this.updateSkills(existingSkills.id, resumeData.skills);
    } else {
      await this.createSkills(resumeData.skills, resumeId);
    }
    
    return {
      ...resumeData,
      id: resumeId
    };
  }

  // Personal Info operations
  async createPersonalInfo(personalInfo: InsertPersonalInfo, resumeId: number): Promise<PersonalInfo> {
    const [newPersonalInfo] = await db
      .insert(resumePersonalInfo)
      .values({
        ...personalInfo,
        resumeId
      })
      .returning();
    return newPersonalInfo;
  }

  async getPersonalInfo(resumeId: number): Promise<PersonalInfo | undefined> {
    const [personalInfo] = await db
      .select()
      .from(resumePersonalInfo)
      .where(eq(resumePersonalInfo.resumeId, resumeId));
    return personalInfo || undefined;
  }

  async updatePersonalInfo(id: number, personalInfo: Partial<InsertPersonalInfo>): Promise<PersonalInfo | undefined> {
    const [updatedPersonalInfo] = await db
      .update(resumePersonalInfo)
      .set(personalInfo)
      .where(eq(resumePersonalInfo.id, id))
      .returning();
    return updatedPersonalInfo || undefined;
  }

  // Summary operations
  async createSummary(summary: InsertSummary, resumeId: number): Promise<Summary> {
    const [newSummary] = await db
      .insert(resumeSummary)
      .values({
        ...summary,
        resumeId
      })
      .returning();
    return newSummary;
  }

  async getSummary(resumeId: number): Promise<Summary | undefined> {
    const [summary] = await db
      .select()
      .from(resumeSummary)
      .where(eq(resumeSummary.resumeId, resumeId));
    return summary || undefined;
  }

  async updateSummary(id: number, summary: Partial<InsertSummary>): Promise<Summary | undefined> {
    const [updatedSummary] = await db
      .update(resumeSummary)
      .set(summary)
      .where(eq(resumeSummary.id, id))
      .returning();
    return updatedSummary || undefined;
  }

  // Experience operations
  async createExperience(experience: InsertExperience, resumeId: number): Promise<Experience> {
    const [newExperience] = await db
      .insert(resumeExperience)
      .values({
        ...experience,
        resumeId,
        bulletPoints: experience.bulletPoints || []
      })
      .returning();
    return newExperience;
  }

  async getExperiences(resumeId: number): Promise<Experience[]> {
    return db
      .select()
      .from(resumeExperience)
      .where(eq(resumeExperience.resumeId, resumeId));
  }

  async getExperience(id: number): Promise<Experience | undefined> {
    const [experience] = await db
      .select()
      .from(resumeExperience)
      .where(eq(resumeExperience.id, id));
    return experience || undefined;
  }

  async updateExperience(id: number, experience: Partial<InsertExperience>): Promise<Experience | undefined> {
    const [updatedExperience] = await db
      .update(resumeExperience)
      .set(experience)
      .where(eq(resumeExperience.id, id))
      .returning();
    return updatedExperience || undefined;
  }

  async deleteExperience(id: number): Promise<boolean> {
    const result = await db
      .delete(resumeExperience)
      .where(eq(resumeExperience.id, id));
    return !!result.count;
  }

  // Education operations
  async createEducation(education: InsertEducation, resumeId: number): Promise<Education> {
    const [newEducation] = await db
      .insert(resumeEducation)
      .values({
        ...education,
        resumeId
      })
      .returning();
    return newEducation;
  }

  async getEducations(resumeId: number): Promise<Education[]> {
    return db
      .select()
      .from(resumeEducation)
      .where(eq(resumeEducation.resumeId, resumeId));
  }

  async getEducation(id: number): Promise<Education | undefined> {
    const [education] = await db
      .select()
      .from(resumeEducation)
      .where(eq(resumeEducation.id, id));
    return education || undefined;
  }

  async updateEducation(id: number, education: Partial<InsertEducation>): Promise<Education | undefined> {
    const [updatedEducation] = await db
      .update(resumeEducation)
      .set(education)
      .where(eq(resumeEducation.id, id))
      .returning();
    return updatedEducation || undefined;
  }

  async deleteEducation(id: number): Promise<boolean> {
    const result = await db
      .delete(resumeEducation)
      .where(eq(resumeEducation.id, id));
    return !!result.count;
  }

  // Skills operations
  async createSkills(skills: InsertSkills, resumeId: number): Promise<Skills> {
    const [newSkills] = await db
      .insert(resumeSkills)
      .values({
        ...skills,
        resumeId,
        skills: skills.skills || []
      })
      .returning();
    return newSkills;
  }

  async getSkills(resumeId: number): Promise<Skills | undefined> {
    const [skills] = await db
      .select()
      .from(resumeSkills)
      .where(eq(resumeSkills.resumeId, resumeId));
    return skills || undefined;
  }

  async updateSkills(id: number, skills: Partial<InsertSkills>): Promise<Skills | undefined> {
    const [updatedSkills] = await db
      .update(resumeSkills)
      .set(skills)
      .where(eq(resumeSkills.id, id))
      .returning();
    return updatedSkills || undefined;
  }
}

export const storage = new DatabaseStorage();
