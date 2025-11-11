import { ExternalLink, LucideIcon } from "lucide-react";

interface TopicCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  onClick?: () => void;
}

export default function TopicCard({ icon: Icon, title, description, onClick }: TopicCardProps) {
  return (
    <div 
      className="bg-[#F3FAFF]/75 border border-[#D3E0EA]/25 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-6">
        <Icon className="w-8 h-8 text-[#0079C1]" />
        <ExternalLink className="w-5 h-5 text-[#6D7277]" />
      </div>
      <h3 className="text-lg font-semibold text-[#080C0F] mb-2 leading-tight">
        {title}
      </h3>
      <p className="text-sm text-[#6D7277] leading-relaxed">
        {description}
      </p>
    </div>
  );
}
