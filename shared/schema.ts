import { pgTable, text, serial, integer, boolean, json, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Resume Schemas
export const resumes = pgTable("resumes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  title: text("title").notNull(),
  template: text("template").notNull().default("professional"),
  atsScore: integer("ats_score").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const resumePersonalInfo = pgTable("resume_personal_info", {
  id: serial("id").primaryKey(),
  resumeId: integer("resume_id").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  professionalTitle: text("professional_title").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  location: text("location").notNull(),
  linkedin: text("linkedin"),
  portfolio: text("portfolio"),
});

export const resumeSummary = pgTable("resume_summary", {
  id: serial("id").primaryKey(),
  resumeId: integer("resume_id").notNull(),
  summary: text("summary").notNull(),
});

export const resumeExperience = pgTable("resume_experience", {
  id: serial("id").primaryKey(),
  resumeId: integer("resume_id").notNull(),
  jobTitle: text("job_title").notNull(),
  company: text("company").notNull(),
  location: text("location"),
  startDate: text("start_date").notNull(),
  endDate: text("end_date"),
  isCurrentJob: boolean("is_current_job").default(false),
  description: text("description").notNull(),
  // Storing bullet points as JSON
  bulletPoints: json("bullet_points").default([]),
});

export const resumeEducation = pgTable("resume_education", {
  id: serial("id").primaryKey(),
  resumeId: integer("resume_id").notNull(),
  degree: text("degree").notNull(),
  institution: text("institution").notNull(),
  location: text("location"),
  startDate: text("start_date").notNull(),
  endDate: text("end_date"),
  isCurrentEducation: boolean("is_current_education").default(false),
  description: text("description"),
  gpa: text("gpa"),
});

export const resumeSkills = pgTable("resume_skills", {
  id: serial("id").primaryKey(),
  resumeId: integer("resume_id").notNull(),
  // Storing skills as JSON
  skills: json("skills").default([]),
});

// Zod Schemas for validation and type inference

export const insertResumeSchema = createInsertSchema(resumes).pick({
  title: true,
  template: true,
  atsScore: true,
});

export const insertPersonalInfoSchema = createInsertSchema(resumePersonalInfo).pick({
  firstName: true,
  lastName: true,
  professionalTitle: true,
  email: true,
  phone: true,
  location: true,
  linkedin: true,
  portfolio: true,
});

export const insertSummarySchema = createInsertSchema(resumeSummary).pick({
  summary: true,
});

export const insertExperienceSchema = createInsertSchema(resumeExperience).pick({
  jobTitle: true,
  company: true,
  location: true,
  startDate: true,
  endDate: true,
  isCurrentJob: true,
  description: true,
}).extend({
  bulletPoints: z.array(z.string()),
});

export const insertEducationSchema = createInsertSchema(resumeEducation).pick({
  degree: true,
  institution: true,
  location: true,
  startDate: true,
  endDate: true,
  isCurrentEducation: true,
  description: true,
  gpa: true,
});

export const insertSkillsSchema = createInsertSchema(resumeSkills).extend({
  skills: z.array(z.string()),
});

// Complete Resume Schema for the frontend
export const resumeSchema = z.object({
  id: z.number().optional(),
  title: z.string(),
  template: z.string(),
  atsScore: z.number().optional(),
  personalInfo: insertPersonalInfoSchema,
  summary: insertSummarySchema,
  experience: z.array(insertExperienceSchema),
  education: z.array(insertEducationSchema),
  skills: insertSkillsSchema,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertResume = z.infer<typeof insertResumeSchema>;
export type Resume = typeof resumes.$inferSelect;

export type InsertPersonalInfo = z.infer<typeof insertPersonalInfoSchema>;
export type PersonalInfo = typeof resumePersonalInfo.$inferSelect;

export type InsertSummary = z.infer<typeof insertSummarySchema>;
export type Summary = typeof resumeSummary.$inferSelect;

export type InsertExperience = z.infer<typeof insertExperienceSchema>;
export type Experience = typeof resumeExperience.$inferSelect;

export type InsertEducation = z.infer<typeof insertEducationSchema>;
export type Education = typeof resumeEducation.$inferSelect;

export type InsertSkills = z.infer<typeof insertSkillsSchema>;
export type Skills = typeof resumeSkills.$inferSelect;

export type ResumeData = z.infer<typeof resumeSchema>;
