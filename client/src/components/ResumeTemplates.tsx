import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export type TemplateType = "professional" | "minimal" | "modern" | "executive";

interface ResumeTemplatesProps {
  selectedTemplate: TemplateType;
  onSelectTemplate: (template: TemplateType) => void;
}

interface TemplateOption {
  id: TemplateType;
  name: string;
  preview: React.ReactNode;
}

export function ResumeTemplates({ selectedTemplate, onSelectTemplate }: ResumeTemplatesProps) {
  const templates: TemplateOption[] = [
    {
      id: "professional",
      name: "Professional",
      preview: (
        <div className="bg-white rounded h-20 shadow-sm flex flex-col p-1">
          <div className="w-full h-3 bg-primary mb-1 rounded-sm"></div>
          <div className="flex-1 flex">
            <div className="w-1/3 flex flex-col">
              <div className="h-2 w-full bg-muted rounded-sm mb-1"></div>
              <div className="h-2 w-3/4 bg-muted rounded-sm"></div>
            </div>
            <div className="w-2/3 flex flex-col pl-1">
              <div className="h-2 w-full bg-muted rounded-sm mb-1"></div>
              <div className="h-2 w-full bg-muted rounded-sm mb-1"></div>
              <div className="h-2 w-3/4 bg-muted rounded-sm"></div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "minimal",
      name: "Minimal",
      preview: (
        <div className="bg-white rounded h-20 shadow-sm flex flex-col p-1">
          <div className="w-1/4 h-3 bg-gray-800 mb-1 rounded-sm"></div>
          <div className="flex-1 flex">
            <div className="w-1/3 flex flex-col">
              <div className="h-2 w-full bg-muted rounded-sm mb-1"></div>
              <div className="h-2 w-3/4 bg-muted rounded-sm"></div>
            </div>
            <div className="w-2/3 flex flex-col pl-1">
              <div className="h-2 w-full bg-muted rounded-sm mb-1"></div>
              <div className="h-2 w-full bg-muted rounded-sm mb-1"></div>
              <div className="h-2 w-3/4 bg-muted rounded-sm"></div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "modern",
      name: "Modern",
      preview: (
        <div className="bg-white rounded h-20 shadow-sm flex p-1">
          <div className="w-1/3 bg-gray-800"></div>
          <div className="w-2/3 flex flex-col p-1">
            <div className="h-2 w-3/4 bg-muted rounded-sm mb-1"></div>
            <div className="h-2 w-full bg-muted rounded-sm mb-1"></div>
            <div className="h-2 w-full bg-muted rounded-sm mb-1"></div>
            <div className="h-2 w-3/4 bg-muted rounded-sm"></div>
          </div>
        </div>
      )
    },
    {
      id: "executive",
      name: "Executive",
      preview: (
        <div className="bg-white rounded h-20 shadow-sm flex flex-col p-1">
          <div className="w-full h-4 bg-gray-800 mb-1 flex items-center justify-center">
            <div className="h-2 w-1/2 bg-white rounded-sm"></div>
          </div>
          <div className="flex-1 flex">
            <div className="w-full flex flex-col pl-1">
              <div className="h-2 w-full bg-muted rounded-sm mb-1"></div>
              <div className="h-2 w-full bg-muted rounded-sm mb-1"></div>
              <div className="h-2 w-3/4 bg-muted rounded-sm"></div>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div>
      <p className="text-sm font-semibold text-gray-800 uppercase mb-3">Templates</p>
      <div className="grid grid-cols-2 gap-2">
        {templates.map((template) => (
          <div 
            key={template.id}
            className={cn(
              "border-2 border-transparent hover:border-primary rounded-md p-1 cursor-pointer",
              template.id === selectedTemplate && "bg-primary bg-opacity-10 border-2 border-primary"
            )}
            onClick={() => onSelectTemplate(template.id)}
          >
            {template.preview}
            <p className={cn(
              "text-center text-xs mt-1",
              template.id === selectedTemplate ? "font-semibold text-gray-800" : "font-medium text-gray-700"
            )}>
              {template.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
