import { Download, SquareMinus, SearchCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ResumeData } from "@shared/schema";
import { formatDate } from "@/lib/utils";
import { TemplateType } from "./ResumeTemplates";

interface ResumePreviewProps {
  resumeData: ResumeData;
  onDownload: () => void;
}

export function ResumePreview({ resumeData, onDownload }: ResumePreviewProps) {
  const [scale, setScale] = useState(1);

  const increaseScale = () => setScale(prev => Math.min(prev + 0.1, 1.5));
  const decreaseScale = () => setScale(prev => Math.max(prev - 0.1, 0.5));

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-gray-800 p-4 flex justify-between items-center">
        <h2 className="text-white font-semibold">Resume Preview</h2>
        <div className="flex space-x-2">
          <Button
            variant="secondary"
            size="icon"
            onClick={decreaseScale}
            title="Zoom Out"
          >
            <SquareMinus className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            onClick={increaseScale}
            title="Zoom In"
          >
            <SearchCode className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            onClick={onDownload}
            title="Download"
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="p-6 flex justify-center">
        <div 
          className="bg-white shadow-lg w-full max-w-3xl overflow-auto"
          style={{ height: "500px" }}
        >
          {/* Resume Preview Content */}
          <div 
            id="resume-content"
            className="p-8 border border-gray-300"
            style={{ transform: `scale(${scale})`, transformOrigin: "top left" }}
          >
            <ResumeTemplate 
              resumeData={resumeData} 
              template={resumeData.template as TemplateType || "professional"} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}

interface ResumeTemplateProps {
  resumeData: ResumeData;
  template: TemplateType;
}

function ResumeTemplate({ resumeData, template }: ResumeTemplateProps) {
  // Select the appropriate template based on the template prop
  switch (template) {
    case "minimal":
      return <MinimalTemplate resumeData={resumeData} />;
    case "modern":
      return <ModernTemplate resumeData={resumeData} />;
    case "executive":
      return <ExecutiveTemplate resumeData={resumeData} />;
    case "professional":
    default:
      return <ProfessionalTemplate resumeData={resumeData} />;
  }
}

function ProfessionalTemplate({ resumeData }: { resumeData: ResumeData }) {
  const { personalInfo, summary, experience, education, skills } = resumeData;
  
  return (
    <div>
      {/* Resume Header */}
      <div className="border-b-2 border-primary pb-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        <h2 className="text-xl text-primary mt-1">
          {personalInfo.professionalTitle}
        </h2>
        <div className="flex flex-wrap text-sm mt-3 text-gray-700">
          {personalInfo.email && (
            <div className="mr-4 flex items-center">
              <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              <span>{personalInfo.email}</span>
            </div>
          )}
          {personalInfo.phone && (
            <div className="mr-4 flex items-center">
              <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              <span>{personalInfo.phone}</span>
            </div>
          )}
          {personalInfo.location && (
            <div className="mr-4 flex items-center">
              <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <span>{personalInfo.location}</span>
            </div>
          )}
          {personalInfo.linkedin && (
            <div className="mr-4 flex items-center">
              <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              <span>linkedin.com/in/{personalInfo.linkedin}</span>
            </div>
          )}
          {personalInfo.portfolio && (
            <div className="flex items-center">
              <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
              </svg>
              <span>{personalInfo.portfolio}</span>
            </div>
          )}
        </div>
      </div>

      {/* Professional Summary */}
      {summary && summary.summary && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-1 mb-3">
            Professional Summary
          </h3>
          <p className="text-sm text-gray-700">
            {summary.summary}
          </p>
        </div>
      )}

      {/* Work Experience */}
      {experience && experience.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-1 mb-3">
            Work Experience
          </h3>
          
          {experience.map((exp, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between">
                <div>
                  <h4 className="text-base font-semibold">{exp.jobTitle}</h4>
                  <h5 className="text-sm text-primary">{exp.company}</h5>
                </div>
                <div className="text-sm text-gray-700">
                  {formatDate(exp.startDate)} - {exp.isCurrentJob ? 'Present' : formatDate(exp.endDate)}
                </div>
              </div>
              {exp.location && <p className="text-sm text-gray-600">{exp.location}</p>}
              {exp.description && <p className="text-sm mt-1">{exp.description}</p>}
              {exp.bulletPoints && exp.bulletPoints.length > 0 && (
                <ul className="list-disc text-sm ml-5 mt-2 space-y-1">
                  {exp.bulletPoints.map((bullet, bulletIndex) => (
                    <li key={bulletIndex}>{bullet}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-1 mb-3">
            Education
          </h3>
          
          {education.map((edu, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between">
                <div>
                  <h4 className="text-base font-semibold">{edu.degree}</h4>
                  <h5 className="text-sm text-primary">{edu.institution}</h5>
                </div>
                <div className="text-sm text-gray-700">
                  {formatDate(edu.startDate)} - {edu.isCurrentEducation ? 'Present' : formatDate(edu.endDate)}
                </div>
              </div>
              {edu.location && <p className="text-sm text-gray-600">{edu.location}</p>}
              {edu.description && <p className="text-sm mt-1">{edu.description}</p>}
              {edu.gpa && <p className="text-sm mt-1">GPA: {edu.gpa}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {skills && skills.skills && skills.skills.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-1 mb-3">
            Skills
          </h3>
          
          <div className="flex flex-wrap gap-2">
            {skills.skills.map((skill, index) => (
              <span key={index} className="bg-primary bg-opacity-10 text-primary px-3 py-1 rounded-full text-sm">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MinimalTemplate({ resumeData }: { resumeData: ResumeData }) {
  const { personalInfo, summary, experience, education, skills } = resumeData;
  
  return (
    <div className="font-sans">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        <h2 className="text-xl text-gray-700 mt-1">
          {personalInfo.professionalTitle}
        </h2>
        <div className="flex flex-wrap text-sm mt-3 text-gray-600">
          {personalInfo.email && (
            <div className="mr-4">{personalInfo.email}</div>
          )}
          {personalInfo.phone && (
            <div className="mr-4">{personalInfo.phone}</div>
          )}
          {personalInfo.location && (
            <div className="mr-4">{personalInfo.location}</div>
          )}
          {personalInfo.linkedin && (
            <div className="mr-4">linkedin.com/in/{personalInfo.linkedin}</div>
          )}
          {personalInfo.portfolio && (
            <div>{personalInfo.portfolio}</div>
          )}
        </div>
      </div>

      {/* Summary */}
      {summary && summary.summary && (
        <div className="mb-6">
          <h3 className="text-md font-semibold text-gray-800 mb-2">PROFILE</h3>
          <p className="text-sm text-gray-700">{summary.summary}</p>
        </div>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <div className="mb-6">
          <h3 className="text-md font-semibold text-gray-800 mb-2">EXPERIENCE</h3>
          {experience.map((exp, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between">
                <h4 className="text-base font-semibold">{exp.jobTitle}</h4>
                <span className="text-sm text-gray-600">
                  {formatDate(exp.startDate)} - {exp.isCurrentJob ? 'Present' : formatDate(exp.endDate)}
                </span>
              </div>
              <p className="text-sm text-gray-700">{exp.company}{exp.location ? `, ${exp.location}` : ''}</p>
              {exp.bulletPoints && exp.bulletPoints.length > 0 && (
                <ul className="list-disc text-sm ml-5 mt-2 space-y-1 text-gray-700">
                  {exp.bulletPoints.map((bullet, bulletIndex) => (
                    <li key={bulletIndex}>{bullet}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <div className="mb-6">
          <h3 className="text-md font-semibold text-gray-800 mb-2">EDUCATION</h3>
          {education.map((edu, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between">
                <h4 className="text-base font-semibold">{edu.institution}</h4>
                <span className="text-sm text-gray-600">
                  {formatDate(edu.startDate)} - {edu.isCurrentEducation ? 'Present' : formatDate(edu.endDate)}
                </span>
              </div>
              <p className="text-sm text-gray-700">{edu.degree}{edu.location ? `, ${edu.location}` : ''}</p>
              {edu.gpa && <p className="text-sm text-gray-700">GPA: {edu.gpa}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {skills && skills.skills && skills.skills.length > 0 && (
        <div>
          <h3 className="text-md font-semibold text-gray-800 mb-2">SKILLS</h3>
          <p className="text-sm text-gray-700">{skills.skills.join(', ')}</p>
        </div>
      )}
    </div>
  );
}

function ModernTemplate({ resumeData }: { resumeData: ResumeData }) {
  const { personalInfo, summary, experience, education, skills } = resumeData;
  
  return (
    <div className="flex">
      {/* Left sidebar */}
      <div className="w-1/3 bg-gray-800 text-white p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">{personalInfo.firstName}</h1>
          <h1 className="text-2xl font-bold mb-2">{personalInfo.lastName}</h1>
          <p className="text-lg text-gray-300">{personalInfo.professionalTitle}</p>
        </div>
        
        <div className="mb-8">
          <h3 className="text-md font-semibold border-b border-gray-600 pb-2 mb-3">CONTACT</h3>
          <div className="space-y-2 text-sm">
            {personalInfo.email && (
              <div className="flex items-center">
                <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                </svg>
                <span>{personalInfo.email}</span>
              </div>
            )}
            {personalInfo.phone && (
              <div className="flex items-center">
                <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
                </svg>
                <span>{personalInfo.phone}</span>
              </div>
            )}
            {personalInfo.location && (
              <div className="flex items-center">
                <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
                </svg>
                <span>{personalInfo.location}</span>
              </div>
            )}
            {personalInfo.linkedin && (
              <div className="flex items-center">
                <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                <span>linkedin.com/in/{personalInfo.linkedin}</span>
              </div>
            )}
            {personalInfo.portfolio && (
              <div className="flex items-center">
                <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm1 16.057v-3.057h2.994c-.059 1.143-.212 2.24-.456 3.279-.823-.12-1.674-.188-2.538-.222zm1.957 2.162c-.499 1.33-1.159 2.497-1.957 3.456v-3.62c.666.028 1.319.081 1.957.164zm-1.957-7.219v-3.015c.868-.034 1.721-.103 2.548-.224.238 1.027.389 2.111.446 3.239h-2.994zm0-5.014v-3.661c.806.969 1.471 2.15 1.971 3.496-.642.084-1.3.137-1.971.165zm2.703-3.267c1.237.496 2.354 1.228 3.29 2.146-.642.234-1.311.442-2.019.607-.344-.992-.775-1.91-1.271-2.753zm-7.241 13.56c-.244-1.039-.398-2.136-.456-3.279h2.994v3.057c-.865.034-1.714.102-2.538.222zm2.538 1.776v3.62c-.798-.959-1.458-2.126-1.957-3.456.638-.083 1.291-.136 1.957-.164zm-2.994-7.055c.057-1.128.207-2.212.446-3.239.827.121 1.68.19 2.548.224v3.015h-2.994zm1.024-5.179c.5-1.346 1.165-2.527 1.97-3.496v3.661c-.671-.028-1.329-.081-1.97-.165zm-2.005-.35c-.708-.165-1.377-.373-2.018-.607.937-.918 2.053-1.65 3.29-2.146-.496.844-.927 1.762-1.272 2.753zm-.549 1.918c-.264 1.151-.434 2.36-.492 3.611h-3.933c.165-1.658.739-3.197 1.617-4.518.88.361 1.816.67 2.808.907zm.009 9.262c-.988.236-1.92.542-2.797.9-.89-1.328-1.471-2.879-1.637-4.551h3.934c.058 1.265.231 2.488.5 3.651zm.553 1.917c.342.976.768 1.881 1.257 2.712-1.223-.49-2.326-1.211-3.256-2.115.636-.229 1.299-.435 1.999-.597zm9.924 0c.7.163 1.362.367 1.999.597-.931.903-2.034 1.625-3.257 2.116.489-.832.915-1.737 1.258-2.713zm.553-1.917c.27-1.163.442-2.386.501-3.651h3.934c-.167 1.672-.748 3.223-1.638 4.551-.877-.358-1.81-.664-2.797-.9zm.501-5.651c-.058-1.251-.229-2.46-.492-3.611.992-.237 1.929-.546 2.809-.907.877 1.321 1.451 2.86 1.616 4.518h-3.933z"/>
                </svg>
                <span>{personalInfo.portfolio}</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Skills in sidebar */}
        {skills && skills.skills && skills.skills.length > 0 && (
          <div>
            <h3 className="text-md font-semibold border-b border-gray-600 pb-2 mb-3">SKILLS</h3>
            <div className="flex flex-wrap gap-2">
              {skills.skills.map((skill, index) => (
                <span key={index} className="bg-gray-700 px-2 py-1 rounded text-xs mb-2">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Main content */}
      <div className="w-2/3 p-6">
        {/* Summary */}
        {summary && summary.summary && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-300 pb-2 mb-3">
              Professional Summary
            </h3>
            <p className="text-sm text-gray-700">{summary.summary}</p>
          </div>
        )}
        
        {/* Experience */}
        {experience && experience.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-300 pb-2 mb-3">
              Experience
            </h3>
            {experience.map((exp, index) => (
              <div key={index} className="mb-5">
                <div className="flex justify-between">
                  <h4 className="text-base font-semibold text-gray-800">{exp.jobTitle}</h4>
                  <span className="text-sm text-gray-600">
                    {formatDate(exp.startDate)} - {exp.isCurrentJob ? 'Present' : formatDate(exp.endDate)}
                  </span>
                </div>
                <p className="text-sm font-medium text-primary">{exp.company}{exp.location ? `, ${exp.location}` : ''}</p>
                {exp.bulletPoints && exp.bulletPoints.length > 0 && (
                  <ul className="list-disc text-sm ml-5 mt-2 space-y-1 text-gray-700">
                    {exp.bulletPoints.map((bullet, bulletIndex) => (
                      <li key={bulletIndex}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
        
        {/* Education */}
        {education && education.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-300 pb-2 mb-3">
              Education
            </h3>
            {education.map((edu, index) => (
              <div key={index} className="mb-4">
                <div className="flex justify-between">
                  <h4 className="text-base font-semibold text-gray-800">{edu.degree}</h4>
                  <span className="text-sm text-gray-600">
                    {formatDate(edu.startDate)} - {edu.isCurrentEducation ? 'Present' : formatDate(edu.endDate)}
                  </span>
                </div>
                <p className="text-sm font-medium text-primary">{edu.institution}{edu.location ? `, ${edu.location}` : ''}</p>
                {edu.gpa && <p className="text-sm text-gray-700 mt-1">GPA: {edu.gpa}</p>}
                {edu.description && <p className="text-sm text-gray-700 mt-1">{edu.description}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ExecutiveTemplate({ resumeData }: { resumeData: ResumeData }) {
  const { personalInfo, summary, experience, education, skills } = resumeData;
  
  return (
    <div>
      {/* Header banner with name and title */}
      <div className="bg-gray-800 text-white p-4 mb-6 text-center">
        <h1 className="text-2xl font-bold tracking-wider">
          {personalInfo.firstName.toUpperCase()} {personalInfo.lastName.toUpperCase()}
        </h1>
        <h2 className="text-md tracking-wide mt-1">{personalInfo.professionalTitle}</h2>
      </div>
      
      {/* Contact information */}
      <div className="flex justify-center mb-6 text-sm">
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
          {personalInfo.email && (
            <div className="flex items-center">
              <svg className="h-4 w-4 mr-1 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>{personalInfo.email}</span>
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center">
              <svg className="h-4 w-4 mr-1 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>{personalInfo.phone}</span>
            </div>
          )}
          {personalInfo.location && (
            <div className="flex items-center">
              <svg className="h-4 w-4 mr-1 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{personalInfo.location}</span>
            </div>
          )}
          {personalInfo.linkedin && (
            <div className="flex items-center">
              <svg className="h-4 w-4 mr-1 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              <span>linkedin.com/in/{personalInfo.linkedin}</span>
            </div>
          )}
          {personalInfo.portfolio && (
            <div className="flex items-center">
              <svg className="h-4 w-4 mr-1 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
              <span>{personalInfo.portfolio}</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Professional Summary */}
      {summary && summary.summary && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 uppercase mb-2 tracking-wider border-b-2 border-gray-200 pb-1">
            Executive Summary
          </h3>
          <p className="text-sm text-gray-700 leading-relaxed">{summary.summary}</p>
        </div>
      )}
      
      {/* Core Competencies/Skills */}
      {skills && skills.skills && skills.skills.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 uppercase mb-2 tracking-wider border-b-2 border-gray-200 pb-1">
            Core Competencies
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3">
            {skills.skills.map((skill, index) => (
              <div key={index} className="flex items-center">
                <svg className="h-3 w-3 mr-2 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">{skill}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Professional Experience */}
      {experience && experience.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 uppercase mb-2 tracking-wider border-b-2 border-gray-200 pb-1">
            Professional Experience
          </h3>
          {experience.map((exp, index) => (
            <div key={index} className="mb-5">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-1">
                <h4 className="text-base font-bold text-gray-800">{exp.jobTitle}</h4>
                <span className="text-sm text-gray-600">
                  {formatDate(exp.startDate)} - {exp.isCurrentJob ? 'Present' : formatDate(exp.endDate)}
                </span>
              </div>
              <p className="text-sm font-semibold mb-2">{exp.company}{exp.location ? ` | ${exp.location}` : ''}</p>
              {exp.description && <p className="text-sm text-gray-700 mb-2">{exp.description}</p>}
              {exp.bulletPoints && exp.bulletPoints.length > 0 && (
                <ul className="list-disc text-sm ml-5 space-y-1 text-gray-700">
                  {exp.bulletPoints.map((bullet, bulletIndex) => (
                    <li key={bulletIndex}>{bullet}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
      
      {/* Education */}
      {education && education.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 uppercase mb-2 tracking-wider border-b-2 border-gray-200 pb-1">
            Education
          </h3>
          {education.map((edu, index) => (
            <div key={index} className="mb-3">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <div>
                  <h4 className="text-base font-semibold text-gray-800">{edu.degree}</h4>
                  <p className="text-sm">{edu.institution}{edu.location ? `, ${edu.location}` : ''}</p>
                </div>
                <span className="text-sm text-gray-600">
                  {formatDate(edu.startDate)} - {edu.isCurrentEducation ? 'Present' : formatDate(edu.endDate)}
                </span>
              </div>
              {edu.gpa && <p className="text-sm text-gray-700 mt-1">GPA: {edu.gpa}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
