import { cn } from "@/lib/utils";
import { SectionType } from "./ResumeSections";

interface FormStepperProps {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  resumeSections: Array<{
    id: SectionType;
    label: string;
  }>;
}

export function FormStepper({ currentStep, setCurrentStep, resumeSections }: FormStepperProps) {
  return (
    <div className="bg-white rounded-lg shadow-md mb-6 p-4">
      <div className="flex overflow-x-auto">
        {resumeSections.map((section, index) => (
          <button
            key={section.id}
            className={cn(
              "min-w-max flex flex-col items-center mr-4 text-gray-700 hover:text-primary",
              currentStep === index && "text-primary border-b-2 border-primary pb-2"
            )}
            onClick={() => setCurrentStep(index)}
          >
            <div
              className={cn(
                "rounded-full w-8 h-8 flex items-center justify-center mb-1",
                currentStep === index
                  ? "bg-primary text-white"
                  : "bg-muted text-gray-700"
              )}
            >
              {index + 1}
            </div>
            <span className={cn(
              "text-sm",
              currentStep === index && "font-semibold"
            )}>
              {section.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
