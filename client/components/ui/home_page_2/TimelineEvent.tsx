interface TimelineEventProps {
  title: string;
  description: string;
  isLeft?: boolean;
  dotColor?: string;
}

export default function TimelineEvent({ 
  title, 
  description, 
  isLeft = false, 
  dotColor = "#0078E2" 
}: TimelineEventProps) {
  return (
    <div className="lg:flex lg:items-center">
      {isLeft ? (
        <>
          <div className="lg:w-1/2 lg:pr-12">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg">
              <h3 className="text-2xl lg:text-3xl font-bold text-[#049DBF] mb-3">
                {title}
              </h3>
              <p className="text-lg text-[#45556C] leading-relaxed">
                {description}
              </p>
            </div>
          </div>
          <div className="hidden lg:block lg:w-1/2"></div>
        </>
      ) : (
        <>
          <div className="hidden lg:block lg:w-1/2"></div>
          <div className="lg:w-1/2 lg:pl-12">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg">
              <h3 className="text-2xl lg:text-3xl font-bold text-[#049DBF] mb-3">
                {title}
              </h3>
              <p className="text-lg text-[#45556C] leading-relaxed">
                {description}
              </p>
            </div>
          </div>
        </>
      )}
      {/* Timeline dot */}
      <div 
        className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full hidden lg:block"
        style={{ backgroundColor: dotColor }}
      ></div>
    </div>
  );
}
