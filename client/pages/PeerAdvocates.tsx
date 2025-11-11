const advocates = [
  {
    name: "Sarah Chen, 19",
    image:
      "https://api.builder.io/api/v1/image/assets/TEMP/fb7ff9c4fb974ec035416a19087dbffbfd7dc1fc?width=224",
    description:
      "I'm here to listen without judgment and help you navigate any questions about sexual health. Your wellbeing matters, and I'm here to support you.",
  },
  {
    name: "Marcus Johnson, 20",
    image:
      "https://api.builder.io/api/v1/image/assets/TEMP/186e787e18270cef3036f3ea078a512af9b6e6fd?width=224",
    description:
      "As a peer advocate, I understand the challenges you might face. Let's talk openly about your concerns in a safe, supportive space.",
  },
  {
    name: "Priya Patel, 18",
    image:
      "https://api.builder.io/api/v1/image/assets/TEMP/335335383843ac34fc4ceda007b4ba61b259917d?width=224",
    description:
      "I believe everyone deserves access to accurate information and compassionate support. I'm here to guide you through your journey with care.",
  },
  {
    name: "Alex Rivera, 21",
    image:
      "https://api.builder.io/api/v1/image/assets/TEMP/dd2ffb76780087569fa29b481d0f295870069244?width=224",
    description:
      "Your questions are valid, and your feelings matter. I'm trained to provide support and resources to help you make informed decisions.",
  },
  {
    name: "Emma Thompson, 19",
    image:
      "https://api.builder.io/api/v1/image/assets/TEMP/b8a874319ecd3d7975fe480e2d5b066148ea6cfd?width=224",
    description:
      "I'm passionate about creating a judgment-free zone where you can ask anything. Let's work together to find the answers you need.",
  },
  {
    name: "Jordan Lee, 20",
    image:
      "https://api.builder.io/api/v1/image/assets/TEMP/d1c89e9e92bb6e9f50df960e103291c880cedac0?width=224",
    description:
      "Every conversation is confidential and supportive. I'm here to help you feel empowered and informed about your sexual health choices.",
  },
];

export default function PeerAdvocates() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-1 flex flex-col">
        {/* Hero Section */}
        <section style={{ backgroundColor: '#D4EDF4' }} className="px-4 sm:px-8 lg:px-[264.5px] py-12 lg:py-16">
          <div className="max-w-[896px] mx-auto flex flex-col items-center gap-6">
            <h1 className="text-4xl sm:text-5xl lg:text-[67px] font-bold leading-tight lg:leading-[90px] text-center bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(to right, #0092B8, #009689, #155DFC)' }}>
              Peer Advocates
            </h1>
            <p className="text-[#315E5B] text-lg sm:text-xl lg:text-[22px] leading-relaxed lg:leading-[39px] text-center max-w-[768px]">
              Meet our trained peer advocates who are here to guide, support,
              and listen.
            </p>
          </div>
        </section>

        {/* Advocates Grid */}
        <section style={{ backgroundColor: '#FFFFFF' }} className="px-4 sm:px-8 lg:px-20 py-12 lg:py-16 flex flex-col items-center gap-12">
          <div className="w-full max-w-[1280px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {advocates.map((advocate, index) => (
              <div
                key={index}
                style={{ backgroundColor: '#EEF7FF' }}
                className="rounded-2xl p-6 sm:p-8 flex flex-col items-center shadow-md hover:shadow-lg transition-shadow"
              >
                {/* Avatar */}
                <div className="mb-6">
                  <div className="w-28 h-28 rounded-full overflow-hidden shadow-[0_0_0_4px_rgba(0,170,171,0.20),0_10px_15px_-3px_rgba(0,0,0,0.10),0_4px_6px_-4px_rgba(0,0,0,0.10)]">
                    <img
                      src={advocate.image}
                      alt={advocate.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Name */}
                <h3 className="text-brand-dark text-lg sm:text-xl font-bold text-center mb-1">
                  {advocate.name}
                </h3>

                {/* Title */}
                <p className="text-brand-teal text-sm font-semibold text-center mb-4">
                  Peer Advocate
                </p>

                {/* Description */}
                <p className="text-brand-gray text-[13px] leading-[22.75px] text-center">
                  {advocate.description}
                </p>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <button style={{ backgroundImage: 'linear-gradient(to right, #0092B8, #009689, #155DFC)' }} className="px-8 py-3 rounded-[10px] text-white font-semibold text-base lg:text-[17px] leading-7 shadow-[0_20px_25px_-5px_rgba(0,0,0,0.10),0_8px_10px_-6px_rgba(0,0,0,0.10)] hover:opacity-90 transition-opacity">
            Contact a Peer Advocate
          </button>
        </section>
      </main>
    </div>
  );
}
