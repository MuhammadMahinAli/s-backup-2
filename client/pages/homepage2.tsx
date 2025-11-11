import {
  Shield,
  Heart,
  Users,
  CheckCircle,
  AlertTriangle,
  Smartphone,
  Handshake,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  NewsCard,
  TopicCard,
  VideoCard,
  TimelineEvent,
  SectionHeader,
  TabSelector,
  ContactCard,
} from "../components/ui/home_page_2";

export default function Index() {
  const [activeTab, setActiveTab] = useState(0);

  const newsData = [
    {
      title: "Nearly 10,000 out-of-wedlock births among teens recorded in 5 years",
      source: "New Straits Times",
      date: "Feb 2025",
      url: "https://www.nst.com.my/news/nation/2025/02/1180968/nearly-10000-out-wedlock-births-among-teens-recorded-5-years-nancy"
    },
    {
      title: "Students and STDs",
      source: "The Stars",
      date: "Feb 2025",
      url: "https://www.thestar.com.my/news/education/2024/12/01/students-and-stds"
    },
    {
      title: "Young adults majority of new HIV cases in Malaysia",
      source: "The Stars",
      date: "Feb 2025",
      url: "https://www.thestar.com.my/news/nation/2025/08/07/young-adults-majority-of-new-hiv-cases-in-malaysia"
    }
  ];

  const videoData = [
    {
      title: "Understanding Sexual Health",
      description: "Comprehensive guide to sexual health education and awareness",
      duration: "8:15",
      bgColor: "#E4F6F5",
      iconColor: "#155DFC",
      thumbnailUrl: "https://img.youtube.com/vi/H89mFVSvXeQ/maxresdefault.jpg",
      videoUrl: "https://youtu.be/H89mFVSvXeQ"
    },
    {
      title: "Safe Practices & Prevention", 
      description: "Essential insights on safe practices and prevention methods",
      duration: "6:42",
      bgColor: "#E4F6F5",
      iconColor: "#00A63E",
      thumbnailUrl: "https://img.youtube.com/vi/xvoICywcayo/maxresdefault.jpg",
      videoUrl: "https://youtu.be/xvoICywcayo"
    },
    {
      title: "Youth Sexual Health Awareness",
      description: "Educational content focused on youth sexual health topics",
      duration: "9:23",
      bgColor: "#F3E8FF",
      iconColor: "#9810FA",
      thumbnailUrl: "https://img.youtube.com/vi/OKNZUn1i1E8/maxresdefault.jpg",
      videoUrl: "https://www.youtube.com/watch?v=OKNZUn1i1E8"
    },
    {
      title: "Tiny Pages, Big Personality: Folding the SHY Handbook",
      description: "Additional resources and support for sexual health education",
      duration: "7:30",
      bgColor: "#FFF3E0",
      iconColor: "#FF7043",
      thumbnailUrl: "/blog_5.png",
      videoUrl: "https://drive.google.com/file/d/1muKvkx816D8fpybFqJ_n7NLmM7FbCt4x/view?usp=sharing"
    }
  ];

  return (
    <div className="min-h-screen bg-[#F1FBFA]">
      {/* Latest News Section */}
      <section className="bg-gradient-to-b from-[#D4EDF4] to-[#D4EDF4] px-4 sm:px-6 lg:px-18 py-16 lg:py-20">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#226A72] text-center mb-16 lg:mb-20">
            Latest News
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {newsData.map((news, index) => (
              <NewsCard
                key={index}
                title={news.title}
                source={news.source}
                date={news.date}
                url={news.url}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Our Education Topics Section */}
      <section className="bg-white px-4 sm:px-6 lg:px-18 py-16 lg:py-20">
        <div className="max-w-7xl mx-auto">
          <SectionHeader title="Our Education Topics" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            <TopicCard
              icon={Shield}
              title="STIs: Awareness, Testing, Prevention"
              description="Stay informed and protected"
              onClick={() => console.log("STIs topic clicked")}
            />
            <TopicCard
              icon={Heart}
              title="Contraception & Pregnancy"
              description="Make informed family planning decisions"
              onClick={() => console.log("Contraception topic clicked")}
            />
            <TopicCard
              icon={Users}
              title="Consent, Boundaries & Rights"
              description="Understand your rights and respect others"
              onClick={() => console.log("Consent topic clicked")}
            />
            <TopicCard
              icon={CheckCircle}
              title="Safe Sex & Informed Decisions"
              description="Practice safer sexual behaviors"
              onClick={() => console.log("Safe Sex topic clicked")}
            />
            <TopicCard
              icon={AlertTriangle}
              title="Substance Use & Sexual Health"
              description="Understand the risks and connections"
              onClick={() => console.log("Substance Use topic clicked")}
            />
            <TopicCard
              icon={Smartphone}
              title="Digital Safety in Relationships"
              description="Navigate online relationships safely"
              onClick={() => console.log("Digital Safety topic clicked")}
            />
            <TopicCard
              icon={Users}
              title="Preventing Sexual Violence"
              description="Recognize and prevent harmful situations"
              onClick={() => console.log("Sexual Violence topic clicked")}
            />
            <TopicCard
              icon={Handshake}
              title="Healthy Relationships"
              description="Build positive, respectful connections"
              onClick={() => console.log("Healthy Relationships topic clicked")}
            />
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="bg-[#F1FBFA] px-4 sm:px-6 lg:px-18 py-16 lg:py-20">
        <div className="max-w-7xl mx-auto">
          <SectionHeader title="Events" />

          <div className="relative max-w-4xl mx-auto">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-3 bg-[#D6E3F3] rounded-full h-full hidden lg:block z-0"></div>

            {/* Timeline Items */}
            <div className="space-y-16 relative z-10">
              {/* Upcoming Events Label */}
              <div className="flex justify-center">
                <div className="bg-[#AED2FF] text-white px-6 py-3 rounded-lg shadow-lg relative z-20">
                  <span className="font-bold text-lg">Upcoming Events</span>
                </div>
              </div>

              <TimelineEvent
                title="Coming Soon"
                description="Stay tuned for upcoming sexual health awareness events and workshops."
                isLeft={true}
                dotColor="#9219B1"
              />

              {/* Past Events Label */}
              <div className="flex justify-center">
                <div className="bg-[#AED2FF] text-white px-6 py-3 rounded-lg shadow-lg relative z-20">
                  <span className="font-bold text-lg">Past Events</span>
                </div>
              </div>

              <TimelineEvent
                title="Sexual Health Month 2024"
                description="Month-long educational workshops and peer support sessions."
                isLeft={false}
                dotColor="#0078E2"
              />

              <TimelineEvent
                title="World AIDS Day 2024"
                description="Community awareness campaign and free HIV testing drive."
                isLeft={true}
                dotColor="#0078E2"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Video Spotlight Section */}
      <section className="bg-white px-4 sm:px-6 lg:px-18 py-16 lg:py-20">
        <div className="max-w-7xl mx-auto">
          <SectionHeader title="Video Spotlight" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-8">
            {videoData.map((video, index) => (
              <VideoCard
                key={index}
                title={video.title}
                description={video.description}
                duration={video.duration}
                bgColor={video.bgColor}
                iconColor={video.iconColor}
                thumbnailUrl={video.thumbnailUrl}
                videoUrl={video.videoUrl}
                onPlay={() => console.log(`Playing video: ${video.title}`)}
                onTranscript={() => console.log(`Viewing transcript: ${video.title}`)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Get Help & Support Section */}
      <section className="bg-[#F1FBFA] px-4 sm:px-6 lg:px-18 py-16 lg:py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#006D68] to-[#30C6BF] bg-clip-text text-transparent mb-6">
              Get Help & Support
            </h2>
            <p className="text-lg text-[#315E5B] max-w-2xl mx-auto">
              Access confidential support services and find healthcare providers
              near you
            </p>
          </div>

          <TabSelector
            tabs={["On Campus", "Outside Campus"]}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

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

      {/* Footer */}
      <footer className="bg-[#D4EDF4] px-4 sm:px-6 lg:px-18 py-16 lg:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* Branding */}
            <div className="space-y-6">
              <div className="flex items-end gap-4">
                <div className="w-16 h-16 bg-gray-200 rounded"></div>
                <div className="w-20 h-14 bg-gray-200 rounded"></div>
              </div>
              <p className="text-sm text-[#315E5B] leading-relaxed">
                Empowering young people with sexual health knowledge and
                resources.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold text-[#002927] mb-6">
                Quick Links
              </h3>
              <div className="space-y-3">
                <a
                  href="#"
                  className="block text-sm text-[#315E5B] hover:text-[#002927] transition-colors"
                >
                  About Us
                </a>
                <a
                  href="#"
                  className="block text-sm text-[#315E5B] hover:text-[#002927] transition-colors"
                >
                  Resources
                </a>
                <Link
                  to="/get-help"
                  className="block text-sm text-[#315E5B] hover:text-[#002927] transition-colors"
                >
                  Get Help
                </Link>
                <a
                  href="#"
                  className="block text-sm text-[#315E5B] hover:text-[#002927] transition-colors"
                >
                  Contact
                </a>
              </div>
            </div>

            {/* Partners */}
            <div>
              <h3 className="text-lg font-semibold text-[#002927] mb-6">
                Partners
              </h3>
              <div className="space-y-3">
                <a
                  href="#"
                  className="block text-sm text-[#315E5B] hover:text-[#002927] transition-colors"
                >
                  Taylor's University
                </a>
                <a
                  href="#"
                  className="block text-sm text-[#315E5B] hover:text-[#002927] transition-colors"
                >
                  Malaysian AIDS Council
                </a>
                <a
                  href="#"
                  className="block text-sm text-[#315E5B] hover:text-[#002927] transition-colors"
                >
                  Ministry of Health
                </a>
              </div>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-lg font-semibold text-[#002927] mb-6">
                Legal
              </h3>
              <div className="space-y-3">
                <a
                  href="#"
                  className="block text-sm text-[#315E5B] hover:text-[#002927] transition-colors"
                >
                  Privacy Policy
                </a>
                <a
                  href="#"
                  className="block text-sm text-[#315E5B] hover:text-[#002927] transition-colors"
                >
                  Accessibility
                </a>
                <a
                  href="#"
                  className="block text-sm text-[#315E5B] hover:text-[#002927] transition-colors"
                >
                  Terms of Service
                </a>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-[#B2E3DF] pt-8">
            <p className="text-sm text-[#315E5B] text-center">
              © 2024 Taylor's University · SHY - Sexual Health for Youth. All
              rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
