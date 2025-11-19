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

        {/* Action Section */}
        <section style={{ backgroundColor: '#FFFFFF' }} className="px-4 sm:px-8 lg:px-20 py-12 lg:py-16 flex flex-col items-center gap-6">
          {/* Become Peer Advocate Button */}
          <button style={{ backgroundImage: 'linear-gradient(to right, #0092B8, #009689, #155DFC)' }} className="px-8 py-3 rounded-[10px] text-white font-semibold text-base lg:text-[17px] leading-7 shadow-[0_20px_25px_-5px_rgba(0,0,0,0.10),0_8px_10px_-6px_rgba(0,0,0,0.10)] hover:opacity-90 transition-opacity">
            Become Peer Advocate
          </button>

          {/* Login Option */}
          <button className="text-[#315E5B] text-base lg:text-[17px] font-medium hover:text-[#006D68] transition-colors">
            Login
          </button>
        </section>
      </main>
    </div>
  );
}
