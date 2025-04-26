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

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private resumes: Map<number, Resume>;
  private personalInfos: Map<number, PersonalInfo>;
  private summaries: Map<number, Summary>;
  private experiences: Map<number, Experience>;
  private educations: Map<number, Education>;
  private skills: Map<number, Skills>;
  
  private userId: number;
  private resumeId: number;
  private personalInfoId: number;
  private summaryId: number;
  private experienceId: number;
  private educationId: number;
  private skillsId: number;

  constructor() {
    this.users = new Map();
    this.resumes = new Map();
    this.personalInfos = new Map();
    this.summaries = new Map();
    this.experiences = new Map();
    this.educations = new Map();
    this.skills = new Map();
    
    this.userId = 1;
    this.resumeId = 1;
    this.personalInfoId = 1;
    this.summaryId = 1;
    this.experienceId = 1;
    this.educationId = 1;
    this.skillsId = 1;
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Resume operations
  async createResume(insertResume: InsertResume, userId?: number): Promise<Resume> {
    const id = this.resumeId++;
    const now = new Date();
    const resume: Resume = { 
      ...insertResume, 
      id, 
      userId: userId || null, 
      createdAt: now, 
      updatedAt: now 
    };
    this.resumes.set(id, resume);
    return resume;
  }

  async getResumes(userId?: number): Promise<Resume[]> {
    if (userId) {
      return Array.from(this.resumes.values()).filter(
        (resume) => resume.userId === userId
      );
    }
    return Array.from(this.resumes.values());
  }

  async getResume(id: number): Promise<Resume | undefined> {
    return this.resumes.get(id);
  }

  async updateResume(id: number, resume: Partial<InsertResume>): Promise<Resume | undefined> {
    const existingResume = this.resumes.get(id);
    if (!existingResume) return undefined;
    
    const updatedResume: Resume = {
      ...existingResume,
      ...resume,
      updatedAt: new Date()
    };
    
    this.resumes.set(id, updatedResume);
    return updatedResume;
  }

  async deleteResume(id: number): Promise<boolean> {
    return this.resumes.delete(id);
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
    const id = this.personalInfoId++;
    const newPersonalInfo: PersonalInfo = { ...personalInfo, id, resumeId };
    this.personalInfos.set(id, newPersonalInfo);
    return newPersonalInfo;
  }

  async getPersonalInfo(resumeId: number): Promise<PersonalInfo | undefined> {
    return Array.from(this.personalInfos.values()).find(
      (personalInfo) => personalInfo.resumeId === resumeId
    );
  }

  async updatePersonalInfo(id: number, personalInfo: Partial<InsertPersonalInfo>): Promise<PersonalInfo | undefined> {
    const existingPersonalInfo = this.personalInfos.get(id);
    if (!existingPersonalInfo) return undefined;
    
    const updatedPersonalInfo: PersonalInfo = {
      ...existingPersonalInfo,
      ...personalInfo
    };
    
    this.personalInfos.set(id, updatedPersonalInfo);
    return updatedPersonalInfo;
  }

  // Summary operations
  async createSummary(summary: InsertSummary, resumeId: number): Promise<Summary> {
    const id = this.summaryId++;
    const newSummary: Summary = { ...summary, id, resumeId };
    this.summaries.set(id, newSummary);
    return newSummary;
  }

  async getSummary(resumeId: number): Promise<Summary | undefined> {
    return Array.from(this.summaries.values()).find(
      (summary) => summary.resumeId === resumeId
    );
  }

  async updateSummary(id: number, summary: Partial<InsertSummary>): Promise<Summary | undefined> {
    const existingSummary = this.summaries.get(id);
    if (!existingSummary) return undefined;
    
    const updatedSummary: Summary = {
      ...existingSummary,
      ...summary
    };
    
    this.summaries.set(id, updatedSummary);
    return updatedSummary;
  }

  // Experience operations
  async createExperience(experience: InsertExperience, resumeId: number): Promise<Experience> {
    const id = this.experienceId++;
    const newExperience: Experience = { 
      ...experience, 
      id, 
      resumeId, 
      bulletPoints: experience.bulletPoints || []
    };
    this.experiences.set(id, newExperience);
    return newExperience;
  }

  async getExperiences(resumeId: number): Promise<Experience[]> {
    return Array.from(this.experiences.values()).filter(
      (experience) => experience.resumeId === resumeId
    );
  }

  async getExperience(id: number): Promise<Experience | undefined> {
    return this.experiences.get(id);
  }

  async updateExperience(id: number, experience: Partial<InsertExperience>): Promise<Experience | undefined> {
    const existingExperience = this.experiences.get(id);
    if (!existingExperience) return undefined;
    
    const updatedExperience: Experience = {
      ...existingExperience,
      ...experience
    };
    
    this.experiences.set(id, updatedExperience);
    return updatedExperience;
  }

  async deleteExperience(id: number): Promise<boolean> {
    return this.experiences.delete(id);
  }

  // Education operations
  async createEducation(education: InsertEducation, resumeId: number): Promise<Education> {
    const id = this.educationId++;
    const newEducation: Education = { ...education, id, resumeId };
    this.educations.set(id, newEducation);
    return newEducation;
  }

  async getEducations(resumeId: number): Promise<Education[]> {
    return Array.from(this.educations.values()).filter(
      (education) => education.resumeId === resumeId
    );
  }

  async getEducation(id: number): Promise<Education | undefined> {
    return this.educations.get(id);
  }

  async updateEducation(id: number, education: Partial<InsertEducation>): Promise<Education | undefined> {
    const existingEducation = this.educations.get(id);
    if (!existingEducation) return undefined;
    
    const updatedEducation: Education = {
      ...existingEducation,
      ...education
    };
    
    this.educations.set(id, updatedEducation);
    return updatedEducation;
  }

  async deleteEducation(id: number): Promise<boolean> {
    return this.educations.delete(id);
  }

  // Skills operations
  async createSkills(skills: InsertSkills, resumeId: number): Promise<Skills> {
    const id = this.skillsId++;
    const newSkills: Skills = { 
      ...skills, 
      id, 
      resumeId, 
      skills: skills.skills || []
    };
    this.skills.set(id, newSkills);
    return newSkills;
  }

  async getSkills(resumeId: number): Promise<Skills | undefined> {
    return Array.from(this.skills.values()).find(
      (skills) => skills.resumeId === resumeId
    );
  }

  async updateSkills(id: number, skills: Partial<InsertSkills>): Promise<Skills | undefined> {
    const existingSkills = this.skills.get(id);
    if (!existingSkills) return undefined;
    
    const updatedSkills: Skills = {
      ...existingSkills,
      ...skills
    };
    
    this.skills.set(id, updatedSkills);
    return updatedSkills;
  }
}

export const storage = new MemStorage();
