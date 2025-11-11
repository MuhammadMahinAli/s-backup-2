import {
  Calendar,
  User,
  ArrowRight,
  Play,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  FileText,
  ExternalLink,
  X,
} from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../components/ui/dialog";


const blogContent = {
  title: "UNINTENDED PREGNANCY & CONTRACEPTION",
  authors: "Professor Khine Pwint Phyu & Dr Malar Kandasamy",
  content: `Unintended pregnancy is a reality that many young people face around the world. Whether due to lack of access to contraception, misinformation, or sexual coercion, discovering a pregnancy that wasn't intended can be overwhelming.

In 2019 adolescents aged 15-19 years had an estimated 21 million pregnancies each year and of this almost 50% were unintended. This leads to about 12 million births.

According to data from the Ministry of Health Malaysia, the rate of teenage pregnancies increased by 42% between 2010 and 2020.

In 2010, there were approximately 15,000 reported cases of teenage pregnancies, while in 2020, this number rose to over 21,000.

According to data released by WHO in 2023 this same data also showed that 55% of unintended pregnancies among 15 -19 years old ended up in abortions which are often unsafe

What Is an Unintended Pregnancy?

An unintended pregnancy is one that occurs when a person is not intending to become pregnant—either at that time (mistimed) or at all (unwanted).

WHO recognizes unintended pregnancy as a major public health concern, especially among adolescents, and encourages interventions like comprehensive sex education, youth-friendly reproductive health services, and access to contraception.

How to know you are Pregnant?

How Can you Confirm Pregnancy?

Home Pregnancy Test
• Detects the hormone hCG in urine
• Most accurate when done after a missed period
• easily available across the counter and easy to use
• Can be done at home by the young adult

Clinical Diagnosis by ultrasound
• A doctor can perform an ultrasound to confirm this pregnancy – location and gestation/ how many weeks of pregnancy

Emotional Responses to an Unintended Pregnancy

I. Emotional Responses:
• Shock and Denial: The initial realization of an unintended pregnancy can be shocking, leading to a period of denial or disbelief.
• Anxiety and Fear: Fear about the future, financial stability, and the impact on relationships is common.
• Conflicting Emotions: It's normal to feel a mix of positive and negative emotions, such as excitement and anxiety, or joy and resentment.
• Sadness and Depression: Feelings of sadness, hopelessness, or even depression can arise, especially when dealing with feelings of loss or disappointment
• Guilt and Shame: If the pregnancy was unexpected or unwanted, guilt or shame might be experienced, particularly if there are societal pressures or personal beliefs about abortion or parenthood.
• Sense of Loss: Feelings of loss about one's previous life, freedom, or relationship status are also common, according to The Conversation.

II. Physical Reactions:
• Hormonal Changes: Pregnancy hormones can lead to physical symptoms like fatigue, nausea, and changes in appetite.
• Body Image Concerns: Changes in body image and physical appearance can also cause anxiety and self-consciousness.

III. Impact on Relationships:
• Strain on Relationships: Unintended pregnancies can put a strain on relationships, particularly with partners or family members who may not be supportive.
• Social Support: Lack of social support from family or friends can exacerbate feelings of isolation and anxiety. Increased social isolation due to stigma and discrimination.

IV. Seeking Support:
• Counseling: Seeking professional support from a therapist or counselor can help individuals process their emotions and make informed decisions
• Support Groups: Connecting with others who have experienced Unintended pregnancies can provide a sense of community and shared understanding.
• Open Communication: Talking to trusted friends, family members, or partners can help individuals feel less alone and more supported.

V. Decision-Making:
• Options: It's crucial to understand all available options, including parenting, adoption, and abortion, and to weigh the pros and cons of each.
• Informed Choices: Making informed decisions based on individual circumstances and values is essential, and seeking professional guidance can be helpful.
• Long-Term Impact: It's important to consider the potential long-term consequences of each decision, including social, emotional, and financial implications.

A young adults reaction to an unwanted pregnancy can be highly personal and vary from one person to another. What seems to be a difficult situation to one person could be a catalyst for growth and resilience for another.

It's normal to feel overwhelmed, scared, anxious, or even numb. Every person's emotional response is different.

ACOG and RCOG: recommend non-judgmental, supportive, and evidence-based counselling for young people facing Unintended pregnancy.

Consequences of Unintended Pregnancy in Youth

Unintended pregnancy can have far-reaching effects on a young person's life. Health risks include complications in adolescents and unsafe abortion. Educational impacts include school dropouts. Mental health effects involve depression and isolation. Economic effects include poverty and housing issues.

What Can You Do?

The choice is yours to make. As an adult you have the right to make the choice that is best for you with guide from the correct person. Global reproductive health authorities outline three primary options:
1. Continuing Pregnancy and becoming a Parent
2. Continue the Pregnancy and Choose Adoption
3. End the Pregnancy Through Abortion in a legal way

Well, it's not an easy decision or choice to make but guide and appropriate information given you can make the right decision that suits you.

Preventing Unintended Pregnancy

Every young adult/ teenager must be empowered with the most effective strategy effective strategy in preventing Unintended/unwanted/unintended pregnancy which is education + contraception.

Emergency contraception (EC) are methods of preventing a pregnancy after you have had unprotected vaginal intercourse.

EC is effective the sooner they are used after the act of intercourse and are recommended for use within 5 days. EC can be used after unprotected intercourse.

Emergency contraception methods currently available are copper-bearing intrauterine devices (IUCDs) and emergency contraceptive pills (ECPs).

Common methods include:
- Barrier methods (e.g., condoms)
- Hormonal methods (e.g., pills, patch, vaginal rings and depo provera )
- Long-acting reversible contraception (LARC, e.g., Intrauterine device(IUD): Hormonal, copper implant)
- Emergency contraception
- Fertility awareness method
- Abstinence

Conclusion

Unintended pregnancy is a serious issue that affects millions of young people. It is preventable with knowledge, support, and access to contraception.
You have the right to accurate information, safe care, and to make informed decisions about your future.

References
1. WHO. Preventing adolescent pregnancies. https://www.who.int
2. Md. Jani, S. H., & Wagiman, J. (2023). Unwanted pregnancies among teenagers in Malaysia: A growing concern [Monograph]. APB Rembau e Bulletin, 2023. Universiti Teknologi MARA
3. CDC. Unintended Pregnancy. https://www.cdc.gov/reproductivehealth
4. ACOG. Practice Bulletin: Early Pregnancy Loss. https://www.acog.org
5. NICE. Contraceptive services for under 25s. https://www.nice.org.uk
6. RCOG. Providing abortion care. https://www.rcog.org.uk
7. Vishal Gupta, Ran D Goldman. Emergency contraceptive options available for adolescents. Can Fam Physician. 2006 Oct 10;52(10):1219–1220`
};

export default function Index() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleVideoClick = (url: string) => {
    window.open(url, '_blank');
  };

  const handleBlogClick = () => {
    setIsDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-white">


      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#F2F2F2] via-white to-[#91D7F2]/20 py-12 md:py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Browse Tag */}
          <div className="inline-flex items-center px-4 py-2 bg-[#91D7F2]/20 rounded-full mb-6">
            <span className="text-[#049DBF] text-sm font-medium font-geist">
              Browse Our Resources
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight font-geist">
            <span className="text-[#02706B]">SHY Insights &</span>
            <span className="text-[#049DBF]"> Stories</span>
          </h1>

          {/* Description */}
          <p className="text-[#4A5565] text-lg md:text-xl leading-relaxed mb-8 max-w-2xl mx-auto font-geist">
            Discover expert insights, educational content, and inspiring stories
            that empower young people to make informed health decisions.
          </p>

          {/* CTA Button */}
          <button className="bg-[#049DBF] text-white px-6 py-3 rounded-2xl font-semibold text-lg flex items-center gap-2 mx-auto hover:bg-[#037c9a] transition-colors shadow-lg font-geist">
            Explore Resources
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Featured Content Section */}
      <section className="py-12 md:py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-[#02706B] text-2xl md:text-3xl font-bold mb-4 font-geist">
              Featured Content
            </h2>
            <p className="text-[#4A5565] text-lg font-geist">
              Our most impactful educational content
            </p>
          </div>

          {/* Featured Video */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="relative bg-[#F3F4F6] aspect-video cursor-pointer" onClick={() => handleVideoClick('https://youtu.be/H89mFVSvXeQ')}>
              <img
                src="https://img.youtube.com/vi/H89mFVSvXeQ/maxresdefault.jpg"
                alt="Unintended Pregnancy & Contraception"
                className="w-full h-full object-cover"
              />

              {/* Play Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <button className="bg-red-600 text-white rounded-lg p-4 hover:bg-red-700 transition-colors">
                  <Play className="w-8 h-8 fill-current" />
                </button>
              </div>

              {/* Video Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-black/75 backdrop-blur-sm p-4 md:p-8">
                <div className="flex flex-wrap items-center gap-4 md:gap-6 mb-4">
                  <span className="bg-white/50 text-white px-3 py-1 rounded-full text-sm font-geist">
                    Health Education
                  </span>
                  <div className="flex items-center gap-2 text-white text-sm font-geist">
                    <Calendar className="w-4 h-4" />
                    Dec 15, 2024
                  </div>
                  <div className="flex items-center gap-2 text-white text-sm font-geist">
                    <User className="w-4 h-4" />
                    Professor Khine Pwint Phyu & Dr Malar Kandasamy
                  </div>
                </div>
                <h3 className="text-white text-xl md:text-2xl font-bold mb-4 font-geist">
                  Lindungi Diri Anda: Fakta Ringkas Tentang Gonorea
                </h3>
                <p className="text-white text-base md:text-lg leading-relaxed font-geist">
                  A comprehensive guide to understanding unintended pregnancy, 
                  contraception options, and making informed decisions about 
                  your reproductive health.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Resources Section */}
      <section className="py-12 md:py-20 px-4 bg-[#F9FAFB]">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-[#02706B] text-3xl md:text-4xl font-bold mb-6 font-geist">
              Latest Resources
            </h2>
            <p className="text-[#4A5565] text-lg max-w-2xl mx-auto font-geist">
              Stay updated with our latest educational content, expert insights,
              and community stories
            </p>
          </div>

          {/* Resource Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Resource Card 1 - Same YouTube video as featured */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden cursor-pointer" onClick={() => handleVideoClick('https://youtu.be/H89mFVSvXeQ')}>
              <div className="relative bg-[#F3F4F6] aspect-video">
                <img
                  src="https://img.youtube.com/vi/H89mFVSvXeQ/maxresdefault.jpg"
                  alt="Unintended Pregnancy & Contraception"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <button className="bg-red-600 text-white rounded-lg p-3 hover:bg-red-700 transition-colors">
                    <Play className="w-6 h-6 fill-current" />
                  </button>
                </div>
              </div>
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <span className="bg-[#85DEF2]/20 text-[#049DBF] px-3 py-1 rounded-full text-sm font-medium font-geist">
                    Health Education
                  </span>
                  <div className="flex items-center gap-1 text-[#6A7282] text-sm font-geist">
                    <Calendar className="w-4 h-4" />
                    Dec 15, 2024
                  </div>
                </div>
                <h3 className="text-[#02706B] text-xl font-bold mb-4 font-geist">
                  Unintended Pregnancy & Contraception
                </h3>
                <p className="text-[#4A5565] mb-6 leading-relaxed font-geist">
                  A comprehensive guide to understanding unintended pregnancy and contraception options.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#6A7282] text-sm font-geist">
                    <User className="w-4 h-4" />
                    Prof. Khine Pwint Phyu
                  </div>
                  <button className="text-[#049DBF] hover:text-[#037c9a] transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Resource Card 2 - Second YouTube video */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden cursor-pointer" onClick={() => handleVideoClick('https://youtu.be/xvoICywcayo')}>
              <div className="relative bg-[#F3F4F6] aspect-video">
                <img
                  src="https://img.youtube.com/vi/xvoICywcayo/maxresdefault.jpg"
                  alt="Sexual Health Education"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <button className="bg-red-600 text-white rounded-lg p-3 hover:bg-red-700 transition-colors">
                    <Play className="w-6 h-6 fill-current" />
                  </button>
                </div>
              </div>
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <span className="bg-[#85DEF2]/20 text-[#049DBF] px-3 py-1 rounded-full text-sm font-medium">
                    Health Education
                  </span>
                  <div className="flex items-center gap-1 text-[#6A7282] text-sm">
                    <Calendar className="w-4 h-4" />
                    Dec 12, 2024
                  </div>
                </div>
                <h3 className="text-[#02706B] text-xl font-bold mb-4">
                  Sexual Health Education
                </h3>
                <p className="text-[#4A5565] mb-6 leading-relaxed">
                  Essential knowledge about sexual health and wellness for young adults.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#6A7282] text-sm">
                    <User className="w-4 h-4" />
                    Health Experts
                  </div>
                  <button className="text-[#049DBF] hover:text-[#037c9a] transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Resource Card 3 - Third YouTube video */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden cursor-pointer" onClick={() => handleVideoClick('https://www.youtube.com/watch?v=OKNZUn1i1E8')}>
              <div className="relative bg-[#F3F4F6] aspect-video">
                <img
                  src="https://img.youtube.com/vi/OKNZUn1i1E8/maxresdefault.jpg"
                  alt="Youth Health and Wellness"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <button className="bg-red-600 text-white rounded-lg p-3 hover:bg-red-700 transition-colors">
                    <Play className="w-6 h-6 fill-current" />
                  </button>
                </div>
              </div>
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <span className="bg-[#85DEF2]/20 text-[#049DBF] px-3 py-1 rounded-full text-sm font-medium">
                    Health & Wellness
                  </span>
                  <div className="flex items-center gap-1 text-[#6A7282] text-sm">
                    <Calendar className="w-4 h-4" />
                    Dec 10, 2024
                  </div>
                </div>
                <h3 className="text-[#02706B] text-xl font-bold mb-4">
                  Youth Health and Wellness
                </h3>
                <p className="text-[#4A5565] mb-6 leading-relaxed">
                  Comprehensive guidance on maintaining health and wellness during adolescence.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#6A7282] text-sm">
                    <User className="w-4 h-4" />
                    Medical Professionals
                  </div>
                  <button className="text-[#049DBF] hover:text-[#037c9a] transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Resource Card 4 - Google Drive document (blog content) */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden cursor-pointer" onClick={handleBlogClick}>
              <div className="relative bg-[#F3F4F6] aspect-video">
                <div className="w-full h-full bg-gradient-to-br from-[#049DBF] to-[#02706B] flex items-center justify-center">
                  <div className="text-center text-white">
                    <FileText className="w-16 h-16 mx-auto mb-4 opacity-90" />
                    <h4 className="text-xl font-medium mb-2 font-geist">
                      Educational Document
                    </h4>
                    <p className="text-lg font-geist opacity-80">
                      Click to read full content
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <span className="bg-[#85DEF2]/20 text-[#049DBF] px-3 py-1 rounded-full text-sm font-medium">
                    Research Paper
                  </span>
                  <div className="flex items-center gap-1 text-[#6A7282] text-sm">
                    <Calendar className="w-4 h-4" />
                    Dec 8, 2024
                  </div>
                </div>
                <h3 className="text-[#02706B] text-xl font-bold mb-4">
                  Unintended Pregnancy & Contraception Guide
                </h3>
                <p className="text-[#4A5565] mb-6 leading-relaxed">
                  Comprehensive research document covering all aspects of unintended pregnancy and contraception.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#6A7282] text-sm">
                    <User className="w-4 h-4" />
                    Prof. Khine Pwint Phyu & Dr Malar
                  </div>
                  <button className="text-[#049DBF] hover:text-[#037c9a] transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Resource Card 5 - Google Drive video */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden cursor-pointer" onClick={() => handleVideoClick('https://drive.google.com/file/d/1muKvkx816D8fpybFqJ_n7NLmM7FbCt4x/view?usp=sharing')}>
              <div className="relative bg-[#F3F4F6] aspect-video">
                <img
                  src="/blog_5.png"
                  alt="Educational Video Resource"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <button className="bg-red-600 text-white rounded-lg p-3 hover:bg-red-700 transition-colors">
                    <Play className="w-6 h-6 fill-current" />
                  </button>
                </div>
              </div>
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <span className="bg-[#85DEF2]/20 text-[#049DBF] px-3 py-1 rounded-full text-sm font-medium">
                    Educational Video
                  </span>
                  <div className="flex items-center gap-1 text-[#6A7282] text-sm">
                    <Calendar className="w-4 h-4" />
                    Dec 5, 2024
                  </div>
                </div>
                <h3 className="text-[#02706B] text-xl font-bold mb-4">
                  Health Education Resource
                </h3>
                <p className="text-[#4A5565] mb-6 leading-relaxed">
                  Additional educational content to support your understanding of youth health topics.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#6A7282] text-sm">
                    <User className="w-4 h-4" />
                    Health Educators
                  </div>
                  <button className="text-[#049DBF] hover:text-[#037c9a] transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Resource Card 6 - STIs Awareness */}
            <a href="#" className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
              <div className="relative bg-[#F3F4F6] aspect-video">
                <div className="w-full h-full bg-gradient-to-br from-[#02706B] to-[#049DBF] flex items-center justify-center">
                  <img
                    src="/placeholder.svg"
                    alt="STIs Awareness"
                    className="w-full h-full object-cover opacity-20"
                  />
                </div>
              </div>
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <span className="bg-[#85DEF2]/20 text-[#049DBF] px-3 py-1 rounded-full text-sm font-medium font-geist">
                    Sexually Transmitted Infections (STI) Basics
                  </span>
                  <div className="flex items-center gap-1 text-[#6A7282] text-sm font-geist">
                    <Calendar className="w-4 h-4" />
                    Dec 28, 2024
                  </div>
                </div>
                <h3 className="text-[#02706B] text-xl font-bold mb-4 font-geist">
                  STIs – Awareness, Testing & Prevention
                </h3>
                <p className="text-[#4A5565] mb-6 leading-relaxed font-geist">
                  Comprehensive insight into sexually transmitted infections, covering transmission modes, testing, and preventive practices.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#6A7282] text-sm font-geist">
                    <User className="w-4 h-4" />
                    Prof Priya, Prof Anitha
                  </div>
                  <div className="flex items-center gap-1 text-[#049DBF] group-hover:text-[#037c9a] transition-colors font-geist">
                    <span className="text-sm">Read more</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </a>

            {/* Resource Card 7 - Unintended Pregnancy & Contraception */}
            <a href="#" className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
              <div className="relative bg-[#F3F4F6] aspect-video">
                <div className="w-full h-full bg-gradient-to-br from-[#91D7F2] to-[#85DEF2] flex items-center justify-center">
                  <img
                    src="/placeholder.svg"
                    alt="Contraception"
                    className="w-full h-full object-cover opacity-20"
                  />
                </div>
              </div>
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <span className="bg-[#85DEF2]/20 text-[#049DBF] px-3 py-1 rounded-full text-sm font-medium font-geist">
                    Contraception
                  </span>
                  <div className="flex items-center gap-1 text-[#6A7282] text-sm font-geist">
                    <Calendar className="w-4 h-4" />
                    Dec 25, 2024
                  </div>
                </div>
                <h3 className="text-[#02706B] text-xl font-bold mb-4 font-geist">
                  Unintended Pregnancy & Contraception
                </h3>
                <p className="text-[#4A5565] mb-6 leading-relaxed font-geist">
                  A guide to reproductive health focusing on contraception access, emergency contraception, and informed decision-making.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#6A7282] text-sm font-geist">
                    <User className="w-4 h-4" />
                    Prof Khine, Dr Malar
                  </div>
                  <div className="flex items-center gap-1 text-[#049DBF] group-hover:text-[#037c9a] transition-colors font-geist">
                    <span className="text-sm">Read more</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </a>

            {/* Resource Card 8 - Safe & Informed Sexual Decision Making */}
            <a href="#" className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
              <div className="relative bg-[#F3F4F6] aspect-video">
                <div className="w-full h-full bg-gradient-to-br from-[#049DBF] to-[#91D7F2] flex items-center justify-center">
                  <img
                    src="/placeholder.svg"
                    alt="Smart Choices"
                    className="w-full h-full object-cover opacity-20"
                  />
                </div>
              </div>
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <span className="bg-[#85DEF2]/20 text-[#049DBF] px-3 py-1 rounded-full text-sm font-medium font-geist">
                    Smart Choices
                  </span>
                  <div className="flex items-center gap-1 text-[#6A7282] text-sm font-geist">
                    <Calendar className="w-4 h-4" />
                    Dec 22, 2024
                  </div>
                </div>
                <h3 className="text-[#02706B] text-xl font-bold mb-4 font-geist">
                  Safe & Informed Sexual Decision Making
                </h3>
                <p className="text-[#4A5565] mb-6 leading-relaxed font-geist">
                  Promotes autonomy and harm reduction by introducing PrEP, PEP, condom use, and healthy sexual negotiation.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#6A7282] text-sm font-geist">
                    <User className="w-4 h-4" />
                    Dr Lim, Dr Mugil & Dr Rupinder
                  </div>
                  <div className="flex items-center gap-1 text-[#049DBF] group-hover:text-[#037c9a] transition-colors font-geist">
                    <span className="text-sm">Read more</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </a>

            {/* Resource Card 9 - Your Rights: Consent & Boundaries */}
            <a href="#" className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
              <div className="relative bg-[#F3F4F6] aspect-video">
                <div className="w-full h-full bg-gradient-to-br from-[#85DEF2] to-[#02706B] flex items-center justify-center">
                  <img
                    src="/placeholder.svg"
                    alt="Consent & Boundaries"
                    className="w-full h-full object-cover opacity-20"
                  />
                </div>
              </div>
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <span className="bg-[#85DEF2]/20 text-[#049DBF] px-3 py-1 rounded-full text-sm font-medium font-geist">
                    Consent & Boundaries
                  </span>
                  <div className="flex items-center gap-1 text-[#6A7282] text-sm font-geist">
                    <Calendar className="w-4 h-4" />
                    Dec 20, 2024
                  </div>
                </div>
                <h3 className="text-[#02706B] text-xl font-bold mb-4 font-geist">
                  Your Rights: Consent, Boundaries & Seeking Help
                </h3>
                <p className="text-[#4A5565] mb-6 leading-relaxed font-geist">
                  Empowers youth with legal and ethical literacy on consent, personal boundaries, and where to seek help if violated.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#6A7282] text-sm font-geist">
                    <User className="w-4 h-4" />
                    Dr Aishah, Prof Idzwan, Dr Faizi
                  </div>
                  <div className="flex items-center gap-1 text-[#049DBF] group-hover:text-[#037c9a] transition-colors font-geist">
                    <span className="text-sm">Read more</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </a>

            {/* Resource Card 10 - Substance Use & Sexual Health */}
            <a href="#" className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
              <div className="relative bg-[#F3F4F6] aspect-video">
                <div className="w-full h-full bg-gradient-to-br from-[#91D7F2] to-[#049DBF] flex items-center justify-center">
                  <img
                    src="/placeholder.svg"
                    alt="Sex & Substances"
                    className="w-full h-full object-cover opacity-20"
                  />
                </div>
              </div>
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <span className="bg-[#85DEF2]/20 text-[#049DBF] px-3 py-1 rounded-full text-sm font-medium font-geist">
                    Sex & Substances
                  </span>
                  <div className="flex items-center gap-1 text-[#6A7282] text-sm font-geist">
                    <Calendar className="w-4 h-4" />
                    Dec 18, 2024
                  </div>
                </div>
                <h3 className="text-[#02706B] text-xl font-bold mb-4 font-geist">
                  Substance Use & Sexual Health
                </h3>
                <p className="text-[#4A5565] mb-6 leading-relaxed font-geist">
                  Explores how substances affect judgment, sexual risk-taking, and the intersection of addiction with sexual health.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#6A7282] text-sm font-geist">
                    <User className="w-4 h-4" />
                    Dr Sapna, Dr Dinesh
                  </div>
                  <div className="flex items-center gap-1 text-[#049DBF] group-hover:text-[#037c9a] transition-colors font-geist">
                    <span className="text-sm">Read more</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </a>

            {/* Resource Card 11 - Navigating Digital Influence */}
            <a href="#" className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
              <div className="relative bg-[#F3F4F6] aspect-video">
                <div className="w-full h-full bg-gradient-to-br from-[#049DBF] to-[#85DEF2] flex items-center justify-center">
                  <img
                    src="/placeholder.svg"
                    alt="Digital Influence"
                    className="w-full h-full object-cover opacity-20"
                  />
                </div>
              </div>
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <span className="bg-[#85DEF2]/20 text-[#049DBF] px-3 py-1 rounded-full text-sm font-medium font-geist">
                    Digital Influence
                  </span>
                  <div className="flex items-center gap-1 text-[#6A7282] text-sm font-geist">
                    <Calendar className="w-4 h-4" />
                    Dec 16, 2024
                  </div>
                </div>
                <h3 className="text-[#02706B] text-xl font-bold mb-4 font-geist">
                  Navigating the Digital Influence in Sexual Health
                </h3>
                <p className="text-[#4A5565] mb-6 leading-relaxed font-geist">
                  Encourages critical thinking about unrealistic sexual messaging in social media and the potential harm of pornography.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#6A7282] text-sm font-geist">
                    <User className="w-4 h-4" />
                    Dr Paul, Dr Tesini, Dr Durga
                  </div>
                  <div className="flex items-center gap-1 text-[#049DBF] group-hover:text-[#037c9a] transition-colors font-geist">
                    <span className="text-sm">Read more</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </a>

            {/* Resource Card 12 - Respect & Relationships */}
            <a href="#" className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
              <div className="relative bg-[#F3F4F6] aspect-video">
                <div className="w-full h-full bg-gradient-to-br from-[#02706B] to-[#91D7F2] flex items-center justify-center">
                  <img
                    src="/placeholder.svg"
                    alt="Respect & Relationships"
                    className="w-full h-full object-cover opacity-20"
                  />
                </div>
              </div>
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <span className="bg-[#85DEF2]/20 text-[#049DBF] px-3 py-1 rounded-full text-sm font-medium font-geist">
                    Respect & Relationships
                  </span>
                  <div className="flex items-center gap-1 text-[#6A7282] text-sm font-geist">
                    <Calendar className="w-4 h-4" />
                    Dec 14, 2024
                  </div>
                </div>
                <h3 className="text-[#02706B] text-xl font-bold mb-4 font-geist">
                  Respect, Relationships & Preventing Sexual Violence
                </h3>
                <p className="text-[#4A5565] mb-6 leading-relaxed font-geist">
                  Promotes respect, communication, and abuse prevention through healthy relationship education and support systems.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#6A7282] text-sm font-geist">
                    <User className="w-4 h-4" />
                    Ms Thency, Dr Durga, Prof Ganesh
                  </div>
                  <div className="flex items-center gap-1 text-[#049DBF] group-hover:text-[#037c9a] transition-colors font-geist">
                    <span className="text-sm">Read more</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </a>

            {/* Resource Card 13 - Mental Health & Sexual Wellbeing */}
            <a href="#" className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
              <div className="relative bg-[#F3F4F6] aspect-video">
                <div className="w-full h-full bg-gradient-to-br from-[#85DEF2] to-[#049DBF] flex items-center justify-center">
                  <img
                    src="/placeholder.svg"
                    alt="Mental Health"
                    className="w-full h-full object-cover opacity-20"
                  />
                </div>
              </div>
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <span className="bg-[#85DEF2]/20 text-[#049DBF] px-3 py-1 rounded-full text-sm font-medium font-geist">
                    Mind & Sexual Health
                  </span>
                  <div className="flex items-center gap-1 text-[#6A7282] text-sm font-geist">
                    <Calendar className="w-4 h-4" />
                    Dec 11, 2024
                  </div>
                </div>
                <h3 className="text-[#02706B] text-xl font-bold mb-4 font-geist">
                  Mental Health & Sexual Wellbeing
                </h3>
                <p className="text-[#4A5565] mb-6 leading-relaxed font-geist">
                  Explores emotional resilience and how mental health influences sexual decision-making, anxiety, and trauma recovery.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#6A7282] text-sm font-geist">
                    <User className="w-4 h-4" />
                    Dr Lee, Dr Prabal, Dr Shamala
                  </div>
                  <div className="flex items-center gap-1 text-[#049DBF] group-hover:text-[#037c9a] transition-colors font-geist">
                    <span className="text-sm">Read more</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </a>

            {/* Resource Card 14 - Getting Help */}
            <a href="#" className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
              <div className="relative bg-[#F3F4F6] aspect-video">
                <div className="w-full h-full bg-gradient-to-br from-[#049DBF] to-[#02706B] flex items-center justify-center">
                  <img
                    src="/placeholder.svg"
                    alt="Where to Get Help"
                    className="w-full h-full object-cover opacity-20"
                  />
                </div>
              </div>
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <span className="bg-[#85DEF2]/20 text-[#049DBF] px-3 py-1 rounded-full text-sm font-medium font-geist">
                    Where to Get Help
                  </span>
                  <div className="flex items-center gap-1 text-[#6A7282] text-sm font-geist">
                    <Calendar className="w-4 h-4" />
                    Dec 7, 2024
                  </div>
                </div>
                <h3 className="text-[#02706B] text-xl font-bold mb-4 font-geist">
                  Getting Help: Where to Go for Screening and Support
                </h3>
                <p className="text-[#4A5565] mb-6 leading-relaxed font-geist">
                  Lists accessible clinics and support centers offering screening, counseling, and guidance for sexual health needs.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#6A7282] text-sm font-geist">
                    <User className="w-4 h-4" />
                    Dr Dinesh, Dr Sapna, Dr Durga
                  </div>
                  <div className="flex items-center gap-1 text-[#049DBF] group-hover:text-[#037c9a] transition-colors font-geist">
                    <span className="text-sm">Read more</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Stay Connected Section */}
      <section className="py-12 md:py-20 px-4 bg-gradient-to-r from-[#91D7F2]/10 to-[#85DEF2]/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-[#02706B] text-3xl md:text-4xl font-bold mb-6 font-geist">
            Stay Connected
          </h2>
          <p className="text-[#4A5565] text-lg md:text-xl leading-relaxed mb-12 max-w-2xl mx-auto font-geist">
            Never miss an update—subscribe now for the latest insights and
            resources delivered to your inbox.
          </p>

          {/* Newsletter Form */}
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-16">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-2xl border border-[#E5E7EB] bg-transparent focus:outline-none focus:ring-2 focus:ring-[#049DBF] focus:border-transparent"
            />
            <button className="bg-[#049DBF] text-white px-8 py-3 rounded-2xl font-semibold hover:bg-[#037c9a] transition-colors">
              Subscribe
            </button>
          </div>

          {/* Social Media Icons */}
          <div className="flex items-center justify-center gap-6">
            <a
              href="#"
              className="bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all text-[#049DBF] hover:text-[#037c9a]"
            >
              <Facebook className="w-6 h-6" />
            </a>
            <a
              href="#"
              className="bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all text-[#049DBF] hover:text-[#037c9a]"
            >
              <Twitter className="w-6 h-6" />
            </a>
            <a
              href="#"
              className="bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all text-[#049DBF] hover:text-[#037c9a]"
            >
              <Instagram className="w-6 h-6" />
            </a>
            <a
              href="#"
              className="bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all text-[#049DBF] hover:text-[#037c9a]"
            >
              <Youtube className="w-6 h-6" />
            </a>
          </div>
        </div>
      </section>

      {/* Blog Content Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="space-y-4">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-[#049DBF]" />
              <DialogTitle className="text-2xl font-bold text-[#02706B] font-geist">
                {blogContent.title}
              </DialogTitle>
            </div>
            <DialogDescription className="text-lg text-[#4A5565] font-geist">
              By {blogContent.authors}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-6">
            <div className="prose prose-lg max-w-none text-[#4A5565] leading-relaxed font-geist">
              {blogContent.content.split('\n\n').map((paragraph, index) => (
                <p key={index} className="mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Footer with action buttons */}
          <div className="flex justify-between items-center pt-6 mt-8 border-t border-[#E5E7EB]">
            <button
              onClick={() => setIsDialogOpen(false)}
              className="px-6 py-2 text-[#6A7282] hover:text-[#02706B] transition-colors font-geist"
            >
              Close
            </button>
            <div className="flex gap-3">
              <button 
                onClick={() => window.open('/Unintended pregnancy - SHY.pdf', '_blank')}
                className="px-6 py-2 bg-[#F3FAFF] text-[#049DBF] border border-[#049DBF] rounded-lg hover:bg-[#049DBF] hover:text-white transition-colors font-geist flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                View Original Document (PDF)
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}
