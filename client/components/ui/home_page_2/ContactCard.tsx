interface ContactCardProps {
  phoneNumber: string;
  title: string;
  location: string;
  bgColor?: string;
  textColor?: string;
}

export default function ContactCard({ 
  phoneNumber, 
  title, 
  location,
  bgColor = "#017F8D",
  textColor = "white"
}: ContactCardProps) {
  return (
    <div className={`p-8`} style={{ backgroundColor: bgColor, color: textColor }}>
      <h3 className="text-3xl md:text-5xl font-normal tracking-tight mb-2">
        {phoneNumber}
      </h3>
      <h4 className="text-xl md:text-2xl font-bold mb-2">
        {title}
      </h4>
      <p className="text-lg opacity-90">
        {location}
      </p>
    </div>
  );
}
