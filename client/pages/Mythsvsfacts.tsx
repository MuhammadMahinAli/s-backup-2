const mythsAndFacts = [
  {
    myth: "You can't get pregnant the first time you have sex.",
    fact: "Birth control pills only prevent pregnancy. Condoms are the most effective way to reduce the risk of STIs during sexual activity.",
  },
  {
    myth: "Birth control pills protect against STIs.",
    fact: "Birth control pills only prevent pregnancy. Condoms are the most effective way to reduce the risk of STIs during sexual activity.",
  },
  {
    myth: "You can tell if someone has an STI just by looking at them.",
    fact: "Many STIs have no visible symptoms. The only way to know for sure is through testing. Regular testing is important for sexually active individuals.",
  },
  {
    myth: "Pulling out is an effective form of birth control.",
    fact: "The withdrawal method is not reliable. Pre-ejaculate can contain sperm, and timing is difficult to control. Use proper contraception instead.",
  },
  {
    myth: "Only people with multiple partners need to worry about STIs.",
    fact: "Anyone who is sexually active can get an STI, regardless of the number of partners. It only takes one exposure to contract an infection.",
  },
  {
    myth: "You can get HIV from kissing or sharing drinks.",
    fact: "HIV is not transmitted through saliva, kissing, or sharing drinks. It spreads through specific bodily fluids like blood and sexual fluids.",
  },
];

const MythIcon = () => (
  <svg
    className="w-6 h-6 flex-shrink-0"
    viewBox="0 0 25 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12.5 22C18.0228 22 22.5 17.5228 22.5 12C22.5 6.47715 18.0228 2 12.5 2C6.97715 2 2.5 6.47715 2.5 12C2.5 17.5228 6.97715 22 12.5 22Z"
      stroke="#E7000B"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M15.5 9L9.5 15"
      stroke="#E7000B"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9.5 9L15.5 15"
      stroke="#E7000B"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const FactIcon = () => (
  <svg
    className="w-6 h-6 flex-shrink-0"
    viewBox="0 0 25 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12.5 22.5C18.0228 22.5 22.5 18.0228 22.5 12.5C22.5 6.97715 18.0228 2.5 12.5 2.5C6.97715 2.5 2.5 6.97715 2.5 12.5C2.5 18.0228 6.97715 22.5 12.5 22.5Z"
      stroke="#00A7A8"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9.5 12.5L11.5 14.5L15.5 10.5"
      stroke="#00A7A8"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function MythsVsFacts() {
  return (
    <div className="min-h-screen bg-white">
      <main className="w-full">
        <section className="w-full bg-gradient-to-br from-[rgba(0,170,171,0.10)] via-[rgba(0,135,123,0.10)] to-[rgba(0,182,190,0.10)] px-4 md:px-12 lg:px-[72.5px] py-12 md:py-16">
          <div className="max-w-[1280px] mx-auto flex flex-col items-center gap-4">
            <div className="inline-flex px-4 py-2.5 justify-center items-center rounded-full bg-[rgba(0,170,171,0.10)]">
              <span className="text-[#00AAAB] text-center font-geist text-sm font-bold leading-5">
                Sexual Health Education
              </span>
            </div>

            <h1 className="text-[#161616] text-center font-geist text-4xl md:text-5xl lg:text-[60px] font-bold leading-tight lg:leading-[60px]">
              Myths vs Facts
            </h1>

            <div className="w-full max-w-[768px] pt-2">
              <p className="text-[#636363] text-center font-geist text-lg md:text-xl font-normal leading-relaxed md:leading-[32.5px]">
                Clear the confusion. Learn the truth about sexual health with
                SHY.
              </p>
            </div>
          </div>
        </section>

        <section className="w-full bg-white px-4 md:px-12 lg:px-[72.5px] py-12 md:py-16">
          <div className="w-full max-w-[1338px] mx-auto flex flex-col gap-4">
            {mythsAndFacts.map((item, index) => (
              <div
                key={index}
                className="flex flex-col lg:flex-row items-stretch justify-center gap-4 lg:gap-[35px]"
              >
                <div className="flex-1 lg:w-[639px] min-h-[147px] px-6 md:px-7 py-6 md:py-[29px] flex flex-col items-start gap-2.5 rounded-xl bg-gradient-to-br from-[rgba(255,255,255,0.20)] to-[rgba(255,255,255,0.55)] backdrop-blur-[21px] shadow-sm" style={{ border: '2px solid rgba(231, 0, 11, 0.6)' }}>
                  <div className="flex flex-col gap-3 w-full">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-7 pt-1 flex flex-col items-start">
                        <MythIcon />
                      </div>
                      <h3 className="text-[#161616] font-geist text-lg font-bold leading-7">
                        Myth
                      </h3>
                    </div>
                    <p className="text-[#161616] font-geist text-base font-normal leading-[26px]">
                      {item.myth}
                    </p>
                  </div>
                </div>

                <div className="flex-1 lg:w-[639px] min-h-[147px] px-6 md:px-7 py-6 md:py-[29px] flex flex-col justify-center items-start gap-2.5 rounded-xl bg-gradient-to-br from-[rgba(255,255,255,0.20)] to-[rgba(255,255,255,0.55)] backdrop-blur-[21px] shadow-sm" style={{ border: '2px solid rgba(0, 170, 171, 0.6)' }}>
                  <div className="flex flex-col gap-3 w-full">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-7 pt-1 flex flex-col items-start">
                        <FactIcon />
                      </div>
                      <h3 className="text-[#00AAAB] font-geist text-lg font-bold leading-7">
                        Fact
                      </h3>
                    </div>
                    <p className="text-[#161616] font-geist text-base font-normal leading-[26px]">
                      {item.fact}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="w-full bg-gradient-to-br from-[rgba(0,170,171,0.05)] via-[rgba(0,135,123,0.05)] to-[rgba(0,182,190,0.05)] px-4 md:px-12 lg:px-[264.5px] py-12 md:py-16">
          <div className="max-w-[896px] mx-auto flex flex-col gap-4">
            <h2 className="text-[#161616] text-center font-geist text-3xl md:text-4xl font-bold leading-tight md:leading-10">
              Need More Information?
            </h2>

            <p className="text-[#636363] text-center font-geist text-base md:text-lg font-normal leading-relaxed md:leading-[29.25px]">
              We're here to support you with accurate information and caring
              guidance.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-start justify-center gap-3 sm:gap-4 pt-2">
              <button className="h-10 px-6 flex items-center justify-center rounded-[14px] bg-gradient-to-r from-[#00AAAB] via-[#00877B] to-[#00B6BE] shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] hover:opacity-90 transition-opacity">
                <span className="text-white text-center font-geist text-sm font-medium leading-5">
                  Learn More Resources
                </span>
              </button>

              <button className="h-10 px-6 sm:px-[26px] flex items-center justify-center rounded-[14px] border-2 border-[#00AAAB] bg-transparent shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] hover:bg-[rgba(0,170,171,0.05)] transition-colors">
                <span className="text-[#00AAAB] text-center font-geist text-sm font-medium leading-5">
                  Contact a Peer Advocate
                </span>
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
