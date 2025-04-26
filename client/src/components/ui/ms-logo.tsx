import { cn } from "@/lib/utils";

interface MsLogoProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export default function MsLogo({ className, ...props }: MsLogoProps) {
  return (
    <svg
      className={cn("h-6 w-6", className)}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="M4 4h7v7H4V4zm9 0h7v7h-7V4zm-9 9h7v7H4v-7zm9 0h7v7h-7v-7z" />
    </svg>
  );
}
