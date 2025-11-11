import { Link } from "react-router-dom";

export default function Index() {
  return (
    <div className="min-h-screen bg-white">

      {/* Hero Section */}
      <section className="flex flex-col lg:flex-row items-center justify-between px-8 md:px-16 py-12 lg:py-20 max-w-7xl mx-auto gap-12">
        {/* Left Content */}
        <div className="flex-1 max-w-[648px] space-y-9">
          <div className="space-y-6">
            <h1 className="text-shy-ebony font-bold text-3xl md:text-4xl lg:text-5xl leading-tight uppercase">
              The SHY Project – A<br />
              Joint Commitment to
              <br />
              Youth Empowerment
            </h1>

            <div className="max-w-[512px]">
              <p className="text-shy-oxford-blue text-lg leading-relaxed">
                SHY (Sexual Health for Youth) is a collaborative initiative
                between Taylor's University and a group of passionate medical
                and tech professionals, working with NGOs to bring change
                through education, support, and technology.
              </p>
            </div>
          </div>

          <button className="bg-gradient-to-r from-[rgba(75,181,185,0.8)] to-[rgba(2,160,166,0.8)] text-shy-hero-bg px-8 py-6 rounded-full text-xl font-semibold shadow-lg border border-[rgba(0,120,226,0.2)] backdrop-blur-md hover:shadow-xl transition-all min-w-[210px]">
            LEARN MORE
          </button>
        </div>

        {/* Right Image */}
        <div className="flex-1 flex justify-center lg:justify-end">
          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/80170803c22023898254adaa1832dbbd9505b759?width=1430"
            alt="Sexual Health Awareness Concept"
            className="max-w-full h-auto max-h-[553px] object-contain"
          />
        </div>
      </section>

      {/* Our Mission Image Section */}
      <section className="py-16 px-8 md:px-16">
        <div className="max-w-6xl mx-auto">
          <img
            src="/our-mission.png"
            alt="Our Mission"
            className="w-full h-auto rounded-lg"
          />
        </div>
      </section>

      {/* Our Team Section */}
      <section className="py-16 px-8 md:px-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-shy-ebony text-4xl font-bold mb-4">Our Team</h2>
          <p className="text-shy-spectra text-xl mb-12">
            Explore Our Success Stories And Innovative Projects
          </p>

          {/* Team Photos */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-12">
            {/* Member 1 */}
            <div
              className="group relative w-[154px] h-[359px] overflow-hidden rounded-[106px] transition-all duration-300 ease-out hover:rounded-[0px] shadow-md hover:shadow-lg focus-within:rounded-[0px]"
            >
              <img
                src="https://api.builder.io/api/v1/image/assets/TEMP/7581b0f640a3f9e9a711c1cc6988164274d67e72?width=308"
                alt="Dr Priya Madhavan"
                className="absolute inset-0 w-full h-full object-cover select-none"
                draggable="false"
              />
              {/* Details panel */}
              <div
                className="absolute left-0 right-0 bottom-0 translate-y-full group-hover:translate-y-0 focus-within:translate-y-0 transition-transform duration-300 ease-out bg-shy-teal-50/90 backdrop-blur-sm text-left px-4 py-5"
              >
                <p className="text-[18px] font-bold text-shy-blue-900 leading-6">Dr Priya Madhavan</p>
                <p className="text-[12px] text-black/70 leading-5 mt-2">
                Associate Professor • Health and Medical Sciences
                </p>
              </div>
            </div>

            {/* Member 2 */}
            <div
              className="group relative w-[153px] h-[359px] overflow-hidden rounded-[106px] transition-all duration-300 ease-out hover:rounded-[0px] shadow-md hover:shadow-lg focus-within:rounded-[0px] md:mt-20"
            >
              <img
                src="https://api.builder.io/api/v1/image/assets/TEMP/8216900c66a2431437ee62eef97373abe39a4718?width=306"
                alt="Dr Durga Vettivel"
                className="absolute inset-0 w-full h-full object-cover select-none"
                draggable="false"
              />
              <div
                className="absolute left-0 right-0 bottom-0 translate-y-full group-hover:translate-y-0 focus-within:translate-y-0 transition-transform duration-300 ease-out bg-shy-teal-50/90 backdrop-blur-sm text-left px-4 py-5"
              >
                <p className="text-[18px] font-bold text-shy-blue-900 leading-6">Dr Durga Vettivel</p>
                <p className="text-[12px] text-black/70 leading-5 mt-2">
                  Senior Lecturer • School of Medicine
                </p>
              </div>
            </div>

            {/* Member 3 */}
            <div
              className="group relative w-[153px] h-[359px] overflow-hidden rounded-[106px] transition-all duration-300 ease-out hover:rounded-[0px] shadow-md hover:shadow-lg focus-within:rounded-[0px]"
            >
              <img
                src="https://api.builder.io/api/v1/image/assets/TEMP/15df74aef9e0864c6492672011a9c9f28451236a?width=306"
                alt="Dr Poornima Mahadevappa"
                className="absolute inset-0 w-full h-full object-cover select-none"
                draggable="false"
              />
              <div
                className="absolute left-0 right-0 bottom-0 translate-y-full group-hover:translate-y-0 focus-within:translate-y-0 transition-transform duration-300 ease-out bg-shy-teal-50/90 backdrop-blur-sm text-left px-4 py-5"
              >
                <p className="text-[18px] font-bold text-shy-blue-900 leading-6">Dr Poornima Mahadevappa</p>
                <p className="text-[12px] text-black/70 leading-5 mt-2">
                  Lecturer • School of Computer Science
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-black text-2xl font-medium">
              …and many more from the School of Medicine and Computer Science.
            </p>
            <p className="text-black text-xl">
              Supported by student leaders, peer educators, and tech innovators.
            </p>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="bg-shy-quote-blue py-16 px-8 md:px-16">
        <div className="max-w-6xl mx-auto text-center">
          <blockquote className="text-shy-quote-text text-4xl md:text-5xl font-normal italic leading-relaxed">
            "SHY doesn't mean silent. Your body, your truth, your voice."
          </blockquote>
        </div>
      </section>
    </div>
  );
}
