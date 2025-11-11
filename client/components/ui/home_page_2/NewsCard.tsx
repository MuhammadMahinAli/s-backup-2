import { ExternalLink } from "lucide-react";

interface NewsCardProps {
  title: string;
  source: string;
  date: string;
  url?: string;
  onReadArticle?: () => void;
}

export default function NewsCard({ title, source, date, url, onReadArticle }: NewsCardProps) {
  return (
    <div className="bg-[#E9F2F9] border border-[#D6E3F3] rounded-2xl overflow-hidden">
      <div className="p-6">
        <h3 className="text-lg lg:text-xl font-bold text-[#049DBF] mb-3 leading-tight">
          {title}
        </h3>
        <div className="flex justify-between items-center mb-6">
          <span className="text-sm text-[#45556C]">{source}</span>
          <span className="bg-[#049DBF]/10 text-[#049DBF] px-2 py-1 rounded-lg text-xs">
            {date}
          </span>
        </div>
        <button 
          onClick={() => {
            if (url) {
              window.open(url, '_blank');
            } else if (onReadArticle) {
              onReadArticle();
            }
          }}
          className="w-full bg-gradient-to-r from-[#4BB5B9]/80 to-[#02A0A6]/80 text-white py-3 px-4 rounded-lg shadow-lg backdrop-blur-sm flex items-center justify-center gap-2 hover:from-[#4BB5B9] hover:to-[#02A0A6] transition-all"
        >
          Read More
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
