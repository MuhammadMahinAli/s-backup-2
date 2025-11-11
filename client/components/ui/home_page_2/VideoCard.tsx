import { Play, Clock, FileText } from "lucide-react";

interface VideoCardProps {
  title: string;
  description: string;
  duration: string;
  bgColor?: string;
  iconColor?: string;
  thumbnailUrl?: string;
  videoUrl?: string;
  onPlay?: () => void;
  onTranscript?: () => void;
}

export default function VideoCard({ 
  title, 
  description, 
  duration, 
  bgColor = "#E4F6F5",
  iconColor = "#155DFC",
  thumbnailUrl,
  videoUrl,
  onPlay,
  onTranscript 
}: VideoCardProps) {
  return (
    <div className="bg-[#F3FAFF]/75 border border-[#D3E0EA]/25 rounded-3xl p-6 shadow-sm">
      <div 
        className="rounded-2xl h-56 flex items-center justify-center mb-6 cursor-pointer relative overflow-hidden group"
        style={{ backgroundColor: bgColor }}
        onClick={() => {
          if (videoUrl) {
            window.open(videoUrl, '_blank');
          } else if (onPlay) {
            onPlay();
          }
        }}
      >
        {thumbnailUrl ? (
          <>
            <img 
              src={thumbnailUrl} 
              alt={title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/30 transition-colors">
              <Play
                className="w-12 h-12 text-white drop-shadow-lg"
                fill="currentColor"
              />
            </div>
          </>
        ) : (
          <Play
            className="w-12 h-12"
            style={{ color: iconColor }}
            fill="currentColor"
          />
        )}
      </div>
      <h3 className="text-xl font-semibold text-[#080C0F] mb-2">
        {title}
      </h3>
      <p className="text-[#6D7277] mb-4">
        {description}
      </p>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#6D7277]" />
          <span className="text-sm text-[#6D7277]">{duration}</span>
        </div>
        <button 
          onClick={onTranscript}
          className="flex items-center gap-2 text-[#080C0F] font-semibold hover:text-[#049DBF] transition-colors"
        >
          <FileText className="w-4 h-4" />
          Transcript
        </button>
      </div>
    </div>
  );
}
