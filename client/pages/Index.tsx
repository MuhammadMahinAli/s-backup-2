import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Shield,
  Heart,
  Users,
  CheckCircle,
  AlertTriangle,
  Smartphone,
  Handshake,
} from "lucide-react";
import { educationTopics, EducationTopic } from "../data/educationTopics";
import TopicDialog from "../components/ui/TopicDialog";
import {
  NewsCard,
  TopicCard,
  VideoCard,
  TimelineEvent,
  SectionHeader,
  TabSelector,
  ContactCard,
} from "../components/ui/home_page_2";

const StatCard = ({
  number,
  description,
}: {
  number: string;
  description: string;
}) => (
  <div className="w-[274px] h-[158px] rounded-[20px] border border-white/30 bg-white/10 backdrop-blur-[25px] p-[41px_0] flex flex-col justify-center items-center gap-[10px] shadow-[0_8px_32px_rgba(31,38,135,0.15)]">
    <div className="flex flex-col items-center gap-5 w-[224.5px]">
      <div className="text-[#017F8D] text-center font-['Segoe_UI'] text-[30px] font-bold leading-9">
        {number}
      </div>
      <div className="text-[#315E5B] text-center font-['Segoe_UI'] text-[18px] font-normal leading-5">
        {description}
      </div>
    </div>
  </div>
);

const FeatureCard = ({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
}) => (
  <div className="w-[320px] p-[16px_32px] border border-white/20 bg-white/10 backdrop-blur-[20px] rounded-[20px] shadow-[0_4px_16px_rgba(31,38,135,0.1)]">
    <div className="flex flex-col items-start">
      <div className="w-20 h-20 p-[13.5px] bg-gradient-to-br from-[#049DBF] to-[#0779A4] rounded-2xl flex justify-center items-center mb-[52px] shadow-lg">
        {icon}
      </div>
      <div className="mb-[42px]">
        <h3 className="text-[#049DBF] font-['Geist'] text-[32px] font-bold leading-8 mb-6">
          {title}
        </h3>
        <p className="text-[#45556C] font-['Geist'] text-[18px] font-normal leading-[26px] w-[240px]">
          {description}
        </p>
      </div>
    </div>
  </div>
);

const ServiceCard = ({
  title,
  icon,
  bgGradient,
}: {
  title: string;
  icon: React.ReactNode;
  bgGradient: string;
}) => (
  <div className="w-[255px] h-[198px] p-[29px_28px] border border-white/80 bg-gradient-to-r from-white/20 to-white/55 backdrop-blur-[21px] rounded-xl flex flex-col items-start gap-[10px]">
    <div className="w-[189.5px] h-20 p-[0_62.75px_16px_62.75px] flex flex-col items-center">
      <div
        className={`w-16 h-16 rounded-2xl ${bgGradient} shadow-lg flex justify-center items-center`}
      >
        {icon}
      </div>
    </div>
    <div className="flex flex-col items-center self-stretch">
      <h3 className="text-[#4BB5B9] text-center font-['Segoe_UI'] text-2xl font-semibold leading-7">
        {title}
      </h3>
    </div>
  </div>
);

export default function Index() {
  const [currentStatIndex, setCurrentStatIndex] = useState(0);
  const [currentFeatureIndex, setCurrentFeatureIndex] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedTopic, setSelectedTopic] = useState<EducationTopic | null>(null);
  const navigate = useNavigate();
  const [isTopicDialogOpen, setIsTopicDialogOpen] = useState(false);

  const handleTopicClick = (topicId: string) => {
    const topic = educationTopics.find(t => t.id === topicId);
    if (topic) {
      setSelectedTopic(topic);
      setIsTopicDialogOpen(true);
    }
  };

  const nextFeature = () => {
    setCurrentFeatureIndex((prev) => (prev + 1) % (features.length - 2));
  };

  const prevFeature = () => {
    setCurrentFeatureIndex((prev) => (prev - 1 + (features.length - 2)) % (features.length - 2));
  };

  const stats = [
    { number: "374M", description: "New STIs Globally (2020)" },
    { number: "62%", description: "Youth Chlamydia Cases (MY)" },
    { number: "10,000", description: "Teen pregnancies (5 years)" },
    { number: "95%", description: "Sexual Transmission" },
  ];

  const features = [
    {
      title: "Promote Awareness",
      description:
        "Increasing understanding of sexual health issues among youth",
      icon: (
        <svg
          width="27"
          height="27"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="9" cy="7" r="4" stroke="white" strokeWidth="2" />
          <path
            d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      title: "Enhance Education",
      description:
        "Providing comprehensive sexual health education and resources",
      icon: (
        <svg
          width="27"
          height="27"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      title: "Facilitate STI Testing",
      description:
        "Making testing accessible and reducing stigma around screening",
      icon: (
        <svg
          width="27"
          height="27"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M14.828 10.586a1 1 0 0 0-1.414 0L12 12l-1.414-1.414a1 1 0 0 0-1.414 1.414L10.586 13.5H8a1 1 0 1 0 0 2h2.586l-1.414 1.414a1 1 0 0 0 1.414 1.414L12 16.914l1.414 1.414a1 1 0 0 0 1.414-1.414L13.414 15.5H16a1 1 0 1 0 0-2h-2.586l1.414-1.414z"
            fill="white"
          />
          <path
            d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7z"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      ),
    },
    {
      title: "Encourage Research",
      description:
        "Supporting evidence-based approaches to youth sexual health",
      icon: (
        <svg
          width="27"
          height="27"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9.663 17h4.673M12 3v1m6.364 1.636-.707.707M21 12h-1M4 12H3m3.343-5.657-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386z"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      title: "Foster Peer Engagement",
      description:
        "Creating supportive communities for open discussion",
      icon: (
        <svg
          width="27"
          height="27"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="9" cy="7" r="4" stroke="white" strokeWidth="2" />
          <path
            d="M22 21v-2a4 4 0 0 0-3-3.87"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M16 3.13a4 4 0 0 1 0 7.75"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M8 14s-1.5 2-4 2-4-2-4-2"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
  ];

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
    <div className="w-full min-h-screen bg-[#F1FBFA]">


      {/* Hero Section */}
      <section className="relative w-full max-w-[1425px] mx-auto bg-[#D4EDF4] min-h-[724px] px-4 lg:px-0">
        <div className="relative pt-20 pb-16">
          <div className="w-full max-w-[648px] ml-4 lg:ml-16">
            <div className="flex flex-col gap-6 mb-16">
              <h1 className="font-['Segoe_UI'] text-4xl lg:text-[61px] font-bold leading-[1.1]">
                <span className="text-[#226A72]">Welcome to SHY –</span><br />
                <span className="bg-gradient-to-r from-[#4BB5B9] to-[#14B3B9] bg-clip-text text-transparent">Sexual Health for Youth</span>
              </h1>
              <h2 className="text-[#012E44] font-['Segoe_UI'] text-2xl lg:text-[28px] font-semibold">
                Safe Choices Save Lives
              </h2>
              <p className="text-[#0A3F53] font-['Segoe_UI'] text-lg lg:text-xl font-normal leading-7 max-w-[512px]">
                At SHY we believe in empowering young people with the knowledge,
                confidence, and resources to make informed decisions about their
                sexual health.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 lg:gap-7">
              <button 
                onClick={() => navigate("/get-help")}
                className="w-[210px] h-[69px] px-[17px] py-[25px] rounded-full border border-blue-500/20 bg-gradient-to-r from-[#4BB5B9]/80 to-[#02A0A6]/80 shadow-xl backdrop-blur-md flex items-center justify-center gap-2 hover:opacity-90 transition-opacity cursor-pointer"
              >
                <span className="text-[#F9FCFF] font-['Segoe_UI'] text-xl font-semibold">
                  Get Help Now
                </span>
                <svg
                  width="16"
                  height="15"
                  viewBox="0 0 16 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1.66724 7.81262H13.6672"
                    stroke="#F9FCFF"
                    strokeWidth="1.33333"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8.66724 2.18762L14.6672 7.81262L8.66724 13.4376"
                    stroke="#F9FCFF"
                    strokeWidth="1.33333"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <button 
                onClick={() => {
                  const educationSection = document.querySelector('[data-section="education-topics"]');
                  if (educationSection) {
                    educationSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="w-[211px] h-[69px] px-8 py-6 rounded-full border border-gray-300/13 bg-white/45 shadow-sm backdrop-blur-lg hover:bg-white/60 transition-colors cursor-pointer"
              >
                <span className="text-[#080C0F] font-['Segoe_UI'] text-xl font-semibold">
                  Explore Topics
                </span>
              </button>
            </div>
          </div>

          {/* Service Cards - Right Side */}
          <div className="absolute right-4 lg:right-16 top-24 hidden lg:flex flex-col gap-[22px]">
            <ServiceCard
              title="Clinic"
              bgGradient="bg-[#93D3D8]"
              icon={
                <svg width="33" height="32" viewBox="0 0 33 32" fill="none">
                  <path
                    d="M7.15008 3.06666C7.15483 3.15044 7.18581 3.2306 7.23863 3.29581C7.29146 3.36101 7.36345 3.40795 7.44442 3.42998C7.52539 3.45201 7.61123 3.44802 7.68981 3.41857C7.76839 3.38913 7.83571 3.33571 7.88226 3.26589C7.92881 3.19607 7.95222 3.11338 7.94918 3.02952C7.94614 2.94566 7.9168 2.86489 7.86532 2.79862C7.81384 2.73235 7.74283 2.68395 7.66232 2.66027C7.58182 2.63659 7.49591 2.63883 7.41675 2.66666H6.08341C5.37617 2.66666 4.69789 2.94761 4.1978 3.44771C3.6977 3.94781 3.41675 4.62609 3.41675 5.33333V12C3.41675 14.1217 4.2596 16.1566 5.75989 17.6569C7.26018 19.1571 9.29502 20 11.4167 20C13.5385 20 15.5733 19.1571 17.0736 17.6569C18.5739 16.1566 19.4167 14.1217 19.4167 12V5.33333C19.4167 4.62609 19.1358 3.94781 18.6357 3.44771C18.1356 2.94761 17.4573 2.66666 16.7501 2.66666H15.4167"
                    stroke="#F9FCFF"
                    strokeWidth="2.66667"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M11.4167 20V21.3333C11.4167 23.4551 12.2596 25.4899 13.7599 26.9902C15.2602 28.4905 17.295 29.3333 19.4167 29.3333C21.5385 29.3333 23.5733 28.4905 25.0736 26.9902C26.5739 25.4899 27.4167 23.4551 27.4167 21.3333V16"
                    stroke="#F9FCFF"
                    strokeWidth="2.66667"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M27.4167 16C28.8894 16 30.0833 14.8061 30.0833 13.3333C30.0833 11.8606 28.8894 10.6667 27.4167 10.6667C25.9439 10.6667 24.75 11.8606 24.75 13.3333C24.75 14.8061 25.9439 16 27.4167 16Z"
                    stroke="#F9FCFF"
                    strokeWidth="2.66667"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              }
            />
            <div onClick={() => navigate("/peer-advocates")} className="cursor-pointer">
              <ServiceCard
                title="Peer Advocate"
                bgGradient="bg-gradient-to-br from-blue-500/20 to-blue-500/10"
                icon={
                  <svg width="33" height="32" viewBox="0 0 33 32" fill="none">
                    <path
                      d="M22.0834 28V25.3333C22.0834 23.9188 21.5215 22.5623 20.5213 21.5621C19.5211 20.5619 18.1646 20 16.7501 20H8.75008C7.33559 20 5.97904 20.5619 4.97885 21.5621C3.97865 22.5623 3.41675 23.9188 3.41675 25.3333V28"
                      stroke="#4CB6BA"
                      strokeWidth="2.66667"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12.7501 14.6667C15.6956 14.6667 18.0834 12.2789 18.0834 9.33333C18.0834 6.38781 15.6956 4 12.7501 4C9.80456 4 7.41675 6.38781 7.41675 9.33333C7.41675 12.2789 9.80456 14.6667 12.7501 14.6667Z"
                      stroke="#4CB6BA"
                      strokeWidth="2.66667"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M30.0833 28V25.3333C30.0824 24.1516 29.6891 23.0037 28.9651 22.0698C28.2411 21.1358 27.2274 20.4688 26.0833 20.1733"
                      stroke="#4CB6BA"
                      strokeWidth="2.66667"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M22.0833 4.17334C23.2305 4.46707 24.2473 5.13427 24.9734 6.06975C25.6996 7.00523 26.0937 8.15578 26.0937 9.34001C26.0937 10.5242 25.6996 11.6748 24.9734 12.6103C24.2473 13.5457 23.2305 14.2129 22.0833 14.5067"
                      stroke="#4CB6BA"
                      strokeWidth="2.66667"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                }
              />
            </div>
          </div>

          <div className="absolute right-4 lg:right-[340px] top-24 hidden lg:flex flex-col gap-[22px]">
            <ServiceCard
              title="Testing"
              bgGradient="bg-gradient-to-br from-cyan-500/20 to-cyan-500/10"
              icon={
                <svg width="33" height="32" viewBox="0 0 33 32" fill="none">
                  <path
                    d="M20.0834 2.66667V26C20.0834 27.8667 18.6167 29.3333 16.7501 29.3333C14.8834 29.3333 13.4167 27.8667 13.4167 26V2.66667"
                    stroke="#4BB5B9"
                    strokeWidth="2.66667"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12.0833 2.66667H21.4166"
                    stroke="#4BB5B9"
                    strokeWidth="2.66667"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M20.0834 21.3333H13.4167"
                    stroke="#4BB5B9"
                    strokeWidth="2.66667"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              }
            />
            <div onClick={() => navigate("/myths-vs-facts")} className="cursor-pointer">
              <ServiceCard
                title="Myths vs Facts"
                bgGradient="bg-gradient-to-br from-cyan-500/20 to-cyan-500/10"
                icon={
                  <svg width="33" height="32" viewBox="0 0 33 32" fill="none">
                    <path
                      d="M3.41675 4H11.4167C12.8312 4 14.1878 4.5619 15.188 5.5621C16.1882 6.56229 16.7501 7.91885 16.7501 9.33333V28C16.7501 26.9391 16.3287 25.9217 15.5785 25.1716C14.8284 24.4214 13.8109 24 12.7501 24H3.41675V4Z"
                      stroke="#4BB5B9"
                      strokeWidth="2.66667"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M30.0833 4H22.0833C20.6688 4 19.3123 4.5619 18.3121 5.5621C17.3119 6.56229 16.75 7.91885 16.75 9.33333V28C16.75 26.9391 17.1714 25.9217 17.9216 25.1716C18.6717 24.4214 19.6891 24 20.75 24H30.0833V4Z"
                      stroke="#4BB5B9"
                      strokeWidth="2.66667"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                }
              />
            </div>
          </div>
        </div>
      </section>

      {/* What is Sexual Health Section */}
      <section className="w-full max-w-[1425px] mx-auto px-4 lg:px-[100px] py-[50px] bg-[#F9FCFF] flex justify-center">
        <div className="w-full max-w-[1061px] p-8 border-[1.333px] border-[#DDE0E0] bg-[#F5FEFC] rounded-[20px] shadow-lg backdrop-blur-xl relative">
          <div className="absolute top-2 left-8">
            <svg width="49" height="49" viewBox="0 0 49 49" fill="none">
              <path
                d="M6.5 42.75C12.5 42.75 20.5 40.75 20.5 26.75V10.75C20.5 8.25 18.988 6.716 16.5 6.75H8.5C6 6.75 4.5 8.25 4.5 10.694V22.75C4.5 25.25 6 26.75 8.5 26.75C10.5 26.75 10.5 26.75 10.5 28.75V30.75C10.5 32.75 8.5 34.75 6.5 34.75C4.5 34.75 4.5 34.766 4.5 36.812V40.75C4.5 42.75 4.5 42.75 6.5 42.75Z"
                stroke="#B3DBD3"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M30.5 42.7501C36.5 42.7501 44.5 40.7501 44.5 26.7501V10.7501C44.5 8.25007 42.986 6.71607 40.5 6.75007H32.5C30 6.75007 28.5 8.25007 28.5 10.6941V22.7501C28.5 25.2501 30 26.7501 32.5 26.7501H34C34 31.2501 34.5 34.7501 28.5 34.7501V40.7501C28.5 42.7501 28.5 42.7501 30.5 42.7501Z"
                stroke="#B3DBD3"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="pt-8">
            <h2 className="text-[#0A0A0A] font-['Segoe_UI'] text-[32px] font-bold leading-9 mb-6">
              What is Sexual Health?
            </h2>
            <blockquote className="text-[#0A0A0A] font-['Segoe_UI'] text-[25px] font-normal italic leading-[32.5px] mb-4">
              "...a state of physical, emotional, mental and social well-being
              in relation to sexuality; not merely the absence of disease,
              dysfunction or infirmity."
            </blockquote>
            <p className="text-[#6D7277] font-['Segoe_UI'] text-[18px] font-normal leading-6">
              To achieve this, sexual rights must be respected, protected, and
              fulfilled.
            </p>
          </div>
        </div>
      </section>

      {/* Why Youth Sexual Health Matters Section */}
      <section className="w-full bg-[#D4EDF4] py-16">
        <div className="max-w-[1425px] mx-auto px-4 lg:px-16">
        <div className="flex flex-col items-center gap-12">
          <h2 className="text-[#226A72] font-['Geist'] text-[48px] font-bold leading-[48px] text-center">
            Why Youth Sexual Health Matters?
          </h2>

          <div className="flex items-center gap-8 overflow-hidden">
            <button 
              onClick={prevFeature}
              className="w-[54px] h-[370px] p-[2px] border border-white/30 bg-white/20 backdrop-blur-[15px] rounded-[15px] flex justify-center items-center shadow-[0_4px_16px_rgba(31,38,135,0.2)] hover:bg-white/30 transition-all duration-300">
              <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                <path
                  d="M18.8231 7.53697L11.2502 14.9633L18.6765 22.5363"
                  stroke="#049DBF"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <div className="flex gap-8 overflow-hidden min-h-[370px] items-center">
              <div className="flex gap-8 transition-all duration-500 ease-in-out">
                {features.slice(currentFeatureIndex, currentFeatureIndex + 3).map((feature, index) => (
                  <FeatureCard
                    key={currentFeatureIndex + index}
                    title={feature.title}
                    description={feature.description}
                    icon={feature.icon}
                  />
                ))}
              </div>
            </div>

            <button 
              onClick={nextFeature}
              className="w-[54px] h-[370px] p-[2px] border border-white/30 bg-white/20 backdrop-blur-[15px] rounded-[15px] flex justify-center items-center shadow-[0_4px_16px_rgba(31,38,135,0.2)] hover:bg-white/30 transition-all duration-300">
              <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                <path
                  d="M11.1769 7.53697L18.7498 14.9633L11.3235 22.5363"
                  stroke="#049DBF"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
          
          {/* Indicator dots */}
          <div className="flex justify-center gap-3 mt-8">
            {Array.from({ length: features.length - 2 }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentFeatureIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentFeatureIndex
                    ? 'bg-[#049DBF] scale-110'
                    : 'bg-white/40 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
        </div>
        </div>
      </section>

      {/* Global & Local Statistics Section */}
      <section className="w-full bg-gradient-to-b from-[#87C6D8] to-white px-4 lg:px-[50px] py-20">
        <div className="max-w-[1425px] mx-auto">
          <div className="flex flex-col items-center gap-[74px]">
            <h2 className="text-white font-['Geist'] text-[48px] font-bold leading-[48px] text-center">
              Global & Local Statistics
            </h2>

            <div className="flex justify-center items-center gap-6 w-full overflow-x-auto">
              <button
                onClick={() =>
                  setCurrentStatIndex(Math.max(0, currentStatIndex - 1))
                }
                className="w-[54px] h-[55px] p-[2px] border border-white/30 bg-white/15 backdrop-blur-[20px] rounded-xl flex justify-center items-center shadow-[0_4px_16px_rgba(31,38,135,0.2)] hover:bg-white/25 transition-all duration-300"
              >
                <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                  <path
                    d="M18.75 22.5L11.25 15L18.75 7.5"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <div className="flex gap-6 min-w-0">
                {stats
                  .slice(currentStatIndex, currentStatIndex + 4)
                  .map((stat, index) => (
                    <StatCard
                      key={index}
                      number={stat.number}
                      description={stat.description}
                    />
                  ))}
              </div>

              <button
                onClick={() =>
                  setCurrentStatIndex(
                    Math.min(stats.length - 4, currentStatIndex + 1),
                  )
                }
                className="w-[54px] h-[55px] p-[2px] border border-white/30 bg-white/15 backdrop-blur-[20px] rounded-xl flex justify-center items-center shadow-[0_4px_16px_rgba(31,38,135,0.2)] hover:bg-white/25 transition-all duration-300"
              >
                <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                  <path
                    d="M11.25 22.5L18.75 15L11.25 7.5"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            {/* Data Visualization Section */}
            <div className="w-full max-w-[1179px] flex flex-col gap-9">
              {/* World Map */}
              <div className="h-[840px] p-[40px_30px] border border-[#D6E3F3] bg-[#E9F2F9] rounded-[15px] flex justify-center items-center">
                <img
                  src="https://api.builder.io/api/v1/image/assets/TEMP/fb91abd2293f6562bbc6649166917dc89fb80882?width=2214"
                  alt="Global Sexual Health Statistics Map"
                  className="w-full max-w-[1107px] h-[763px] object-contain rounded-[14px]"
                />
              </div>

              {/* Charts Row */}
              <div className="flex flex-col lg:flex-row gap-[35px]">
                {/* Left Charts */}
                <div className="flex flex-col gap-[30px] w-full lg:w-[412px]">
                  <div className="h-[491px] p-[14px_6px] border border-[#D6E3F3] bg-[#CBE1F2] rounded-[15px] flex justify-center items-center">
                    <img
                      src="https://api.builder.io/api/v1/image/assets/TEMP/c0576730cab8c0c2f760d98c3f8ead17a8c6fa80?width=724"
                      alt="HIV Transmission by Age Groups"
                      className="w-[362px] h-[461px] object-contain"
                    />
                  </div>
                  <div className="h-[457px] p-[0_27px] border border-[#D6E3F3] bg-[#CBE1F2] rounded-[15px] flex justify-center items-end">
                    <img
                      src="https://api.builder.io/api/v1/image/assets/TEMP/a28abc534e54813074d2829d879eda57bdd43bd1?width=690"
                      alt="HIV Transmission by Risk Factors"
                      className="w-[345px] h-[439px] object-contain"
                    />
                  </div>
                </div>

                {/* Right Chart */}
                <div className="w-full lg:w-[720px] h-[978px] p-[13px_26px] border border-[#D6E3F3] bg-[#22A0BB]/58 rounded-[15px] flex flex-col gap-[13px]">
                  <img
                    src="https://api.builder.io/api/v1/image/assets/TEMP/d0ac61c9baa4555a608565229a03bb6272bfb536?width=1336"
                    alt="Registered births in public hospitals and Teen pregnancy statistics"
                    className="h-[880px] object-contain rounded-[11px]"
                  />
                  <p className="text-black font-['Geist'] text-[14px] font-normal leading-5">
                    Source: The Star (2019)
                  </p>
                </div>
              </div>

              {/* Bottom Chart */}
              <div className="h-[840px] p-[25px_30px] border border-[#D6E3F3] bg-[#E9F2F9] rounded-[15px] flex flex-col gap-[10px]">
                <img
                  src="https://api.builder.io/api/v1/image/assets/TEMP/9a723fa7ecfe879f82e5eb0692a3b4713483da4e?width=2240"
                  alt="Malaysian AIDS Statistics and Trends"
                  className="w-full max-w-[1120px] h-[768px] object-contain"
                />
                <p className="text-black font-['Geist'] text-[14px] font-normal leading-5 w-[392px]">
                  Source: Malaysian AIDS Council (2021)
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

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
      <section className="bg-white px-4 sm:px-6 lg:px-18 py-16 lg:py-20" data-section="education-topics">
        <div className="max-w-7xl mx-auto">
          <SectionHeader title="Our Education Topics" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            <TopicCard
              icon={Shield}
              title="STIs: Awareness, Testing, Prevention"
              description="Stay informed and protected"
              onClick={() => handleTopicClick("stis")}
            />
            <TopicCard
              icon={Heart}
              title="Contraception & Pregnancy"
              description="Make informed family planning decisions"
              onClick={() => handleTopicClick("contraception")}
            />
            <TopicCard
              icon={Users}
              title="Consent, Boundaries & Rights"
              description="Understand your rights and respect others"
              onClick={() => handleTopicClick("consent")}
            />
            <TopicCard
              icon={CheckCircle}
              title="Safe Sex & Informed Decisions"
              description="Practice safer sexual behaviors"
              onClick={() => handleTopicClick("safe-sex")}
            />
            <TopicCard
              icon={AlertTriangle}
              title="Substance Use & Sexual Health"
              description="Understand the risks and connections"
              onClick={() => handleTopicClick("substance-use")}
            />
            <TopicCard
              icon={Smartphone}
              title="Digital Safety in Relationships"
              description="Navigate online relationships safely"
              onClick={() => handleTopicClick("digital-safety")}
            />
            <TopicCard
              icon={Users}
              title="Preventing Sexual Violence"
              description="Recognize and prevent harmful situations"
              onClick={() => handleTopicClick("sexual-violence")}
            />
            <TopicCard
              icon={Handshake}
              title="Healthy Relationships"
              description="Build positive, respectful connections"
              onClick={() => handleTopicClick("healthy-relationships")}
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
            onTabChange={(index) => {
              if (index === 1) { // "Outside Campus" tab
                navigate("/get-help");
              } else {
                setActiveTab(index);
              }
            }}
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

      {/* Footer is now globally rendered in Layout */}
      
      {/* Topic Dialog */}
      <TopicDialog 
        topic={selectedTopic}
        open={isTopicDialogOpen}
        onOpenChange={setIsTopicDialogOpen}
      />
    </div>
  );
}
