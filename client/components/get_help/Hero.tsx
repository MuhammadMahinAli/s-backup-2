const Hero = () => {
  return (
    <section className="w-full bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-6 text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-health-primary leading-tight lg:leading-[60px] uppercase">
              Your Health Matters — Here's Where You Can Go
            </h1>

            <p className="text-base lg:text-lg text-[#364153] leading-relaxed lg:leading-[29.25px] max-w-[512px] mx-auto lg:mx-0">
              Whether you're feeling fine or need urgent support, early action
              and accessible services are key. SHY helps you find the right
              help.
            </p>

            <button className="mt-6 lg:mt-8 px-6 py-4 lg:px-8 lg:py-6 bg-gradient-to-r from-[rgba(75,181,185,0.8)] to-[rgba(2,160,166,0.8)] rounded-full text-white font-semibold text-lg lg:text-xl border border-[rgba(0,120,226,0.2)] shadow-[0_10px_15px_-3px_rgba(0,120,226,0.3),0_4px_6px_-4px_rgba(0,120,226,0.3)] backdrop-blur-md hover:opacity-90 transition-opacity min-w-[180px] lg:min-w-[210px]">
              learn more
            </button>
          </div>

          {/* Right Content - Health Illustration */}
          <div className="flex justify-center lg:justify-end order-first lg:order-last">
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/70d2e9ea7fbd457bd31a6595d2b02c976d9d16ce?width=1430"
              alt="Health awareness illustration with diverse healthcare workers"
              className="max-w-full h-auto w-full max-w-[500px] lg:max-w-[715px] lg:max-h-[553px] object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
