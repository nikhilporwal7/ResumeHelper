import { calculateAtsDashOffset, getAtsScoreColor, getAtsScoreText, getAtsScoreDescription } from "@/lib/utils";
import { CheckCircle, Info } from "lucide-react";

interface ATSScoreProps {
  score: number;
}

export function ATSScore({ score }: ATSScoreProps) {
  const dashOffset = calculateAtsDashOffset(score);
  const scoreColor = getAtsScoreColor(score);
  const scoreText = getAtsScoreText(score);
  const scoreDescription = getAtsScoreDescription(score);

  return (
    <div className="flex flex-col items-center mb-6">
      {/* ATS Score SVG Circle */}
      <div className="relative w-32 h-32">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle cx="50" cy="50" r="42" stroke="#EDEBE9" strokeWidth="8" fill="none"></circle>
          {/* Progress circle */}
          <circle 
            className="ats-score-ring" 
            cx="50" 
            cy="50" 
            r="42" 
            stroke={scoreColor} 
            strokeWidth="8" 
            fill="none" 
            strokeDashoffset={dashOffset}
          ></circle>
          <text x="50" y="50" textAnchor="middle" dominantBaseline="middle" className="text-2xl font-semibold">
            {score}
          </text>
          <text x="50" y="65" textAnchor="middle" className="text-xs">
            ATS Score
          </text>
        </svg>
      </div>
      <p className="text-[#107C10] font-semibold mt-2" style={{ color: scoreColor }}>{scoreText}</p>
      <p className="text-sm text-gray-700 text-center mt-1">{scoreDescription}</p>
    </div>
  );
}

interface ATSTipProps {
  tips: Array<{
    type: 'success' | 'info';
    text: string;
  }>;
}

export function ATSTips({ tips }: ATSTipProps) {
  return (
    <div className="mt-6 p-4 bg-[#50E6FF] bg-opacity-10 rounded-md border border-[#50E6FF]">
      <h3 className="font-semibold text-gray-800 flex items-center">
        <Info className="h-5 w-5 text-primary mr-2" />
        ATS Optimization Tips
      </h3>
      <ul className="mt-2 text-sm space-y-2">
        {tips.map((tip, index) => (
          <li key={index} className="flex items-start">
            {tip.type === 'success' ? (
              <CheckCircle className="h-4 w-4 text-[#107C10] mt-0.5 mr-2" />
            ) : (
              <Info className="h-4 w-4 text-primary mt-0.5 mr-2" />
            )}
            <span>{tip.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
