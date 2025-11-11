interface SectionHeaderProps {
  title: string;
  className?: string;
  textColor?: string;
}

export default function SectionHeader({ 
  title, 
  className = "",
  textColor = "text-[#049DBF]"
}: SectionHeaderProps) {
  return (
    <h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold ${textColor} text-center mb-16 lg:mb-20 capitalize ${className}`}>
      {title}
    </h2>
  );
}
