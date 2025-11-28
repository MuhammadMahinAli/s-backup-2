import { ContactCard } from "../components/ui/home_page_2";

export default function GetHelp() {
    return (
        <div className="min-h-screen bg-[#F1FBFA]">
            {/* Hero/Introduction Section */}
            <section className="bg-gradient-to-b from-[#D4EDF4] to-[#F1FBFA] px-4 sm:px-6 lg:px-18 py-16 lg:py-20">
                <div className="max-w-5xl mx-auto">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#226A72] text-center mb-8 uppercase">
                        Getting Help: Where to Go for Screening and Support
                    </h1>

                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 lg:p-12 shadow-lg border border-[#B2E3DF]">
                        <div className="space-y-6 text-[#0A3F53]">
                            <p className="text-lg lg:text-xl leading-relaxed">
                                As a student, your health matters, both now and in the future. Whether you're feeling fine or facing challenges, help and support are always available. You just need to know where to find it! Taking care of your health early can prevent bigger issues later. <strong>Prevention is always better than cure.</strong>
                            </p>

                            <p className="text-lg lg:text-xl leading-relaxed">
                                Below are the key places you can turn to for health screening and support, both on campus and beyond.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Get Help & Support Section */}
            <section className="bg-[#F1FBFA] px-4 sm:px-6 lg:px-18 py-16 lg:py-20">
                <div className="max-w-6xl mx-auto">
                    {/* Support Content */}
                    <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
                        {/* Header Alert */}
                        <div className="bg-gradient-to-r from-[#85DEF2]/25 to-[#85DEF2]/25 p-8 text-center">
                            <h3 className="text-xl md:text-2xl font-normal text-[#017F8D] mb-2">
                                Aware of a fellow student experiencing harassment and in need of
                                support?
                            </h3>
                            <h2 className="text-2xl md:text-4xl font-normal text-[#017F8D] tracking-wide">
                                REACH OUT FOR IMMEDIATE ASSISTANCE
                            </h2>
                        </div>

                        {/* Emergency Numbers */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                            <ContactCard
                                phoneNumber="011-2128 4693"
                                title="STUDENT WELFARE DEPARTMENT"
                                location="Inside Student Life Centre | Block B Level 1"
                            />
                            <ContactCard
                                phoneNumber="03-5629 5214"
                                title="SECURITY CONTROL ROOM"
                                location="Block B Level 1"
                            />
                        </div>

                        {/* Support Information */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8">
                            <div className="lg:col-span-2">
                                <h3 className="text-2xl font-bold text-[#364153] mb-3">
                                    YOU'RE NOT ALONE
                                </h3>
                                <p className="text-xl text-[#364153] mb-4">
                                    We are here for you if you need counselling support or someone
                                    to talk to:
                                </p>
                                <div className="space-y-2">
                                    <h4 className="text-xl font-bold text-[#364153]">
                                        Centre for Counselling Services (Block A, Level 2)
                                    </h4>
                                    <p className="text-xl text-[#364153]">
                                        03-5629 5022 / 5024 / 5025 / 6791 |
                                        counsellor.lsc@taylors.edu.my
                                    </p>
                                    <p className="text-xl text-[#364153]">
                                        Monday–Friday, 8am–6pm
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <div className="border-2 border-[#017F8D] rounded-2xl p-6 text-center">
                                    <p className="text-lg font-bold text-[#017F8D] leading-tight">
                                        TOGETHER, LET'S STAND AGAINST HARASSMENT AND CREATE A SAFER
                                        CAMPUS
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
