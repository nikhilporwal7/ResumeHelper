import { ChevronRight, User, AlignLeft, Briefcase, GraduationCap, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";

export type SectionType = 'personal-info' | 'summary' | 'experience' | 'education' | 'skills';

interface ResumeSectionProps {
  activeSection: SectionType;
  onSectionChange: (section: SectionType) => void;
}

interface SectionItem {
  id: SectionType;
  icon: React.ReactNode;
  label: string;
}

export function ResumeSections({ activeSection, onSectionChange }: ResumeSectionProps) {
  const sections: SectionItem[] = [
    {
      id: 'personal-info',
      icon: <User className="h-4 w-4 mr-3" />,
      label: 'Personal Information'
    },
    {
      id: 'summary',
      icon: <AlignLeft className="h-4 w-4 mr-3" />,
      label: 'Professional Summary'
    },
    {
      id: 'experience',
      icon: <Briefcase className="h-4 w-4 mr-3" />,
      label: 'Work Experience'
    },
    {
      id: 'education',
      icon: <GraduationCap className="h-4 w-4 mr-3" />,
      label: 'Education'
    },
    {
      id: 'skills',
      icon: <Wrench className="h-4 w-4 mr-3" />,
      label: 'Skills'
    }
  ];

  return (
    <nav>
      <p className="text-sm font-semibold text-gray-800 uppercase mb-3">Resume Sections</p>
      <ul>
        {sections.map((section) => (
          <li key={section.id} className="mb-2">
            <a 
              href={`#${section.id}`} 
              onClick={(e) => {
                e.preventDefault();
                onSectionChange(section.id);
              }}
              className={cn(
                "flex items-center p-2 hover:bg-muted rounded-md border-l-4 transition duration-150 ease-in-out",
                activeSection === section.id 
                  ? "bg-primary bg-opacity-10 text-primary border-primary" 
                  : "border-transparent hover:border-primary"
              )}
            >
              {section.icon}
              <span>{section.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
