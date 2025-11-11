import { LucideIcon, Shield, Heart, Users, CheckCircle, AlertTriangle, Smartphone, Handshake } from "lucide-react";

export interface EducationTopic {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  detailedContent: {
    overview: string;
    keyPoints: string[];
    resources: {
      title: string;
      description: string;
      link?: string;
    }[];
    tips: string[];
    getHelp: string;
  };
}

export const educationTopics: EducationTopic[] = [
  {
    id: "stis",
    icon: Shield,
    title: "STIs: Awareness, Testing, Prevention",
    description: "Stay informed and protected",
    detailedContent: {
      overview: "Sexually transmitted infections (STIs) are infections that can be passed from one person to another through sexual contact. Understanding STIs, their symptoms, testing, and prevention is crucial for maintaining sexual health.",
      keyPoints: [
        "STIs are common and many people have no symptoms",
        "Regular testing is important for sexually active individuals",
        "Most STIs are treatable, and some are curable",
        "Prevention methods include condoms, dental dams, and PrEP",
        "Open communication with partners about STI status is important"
      ],
      resources: [
        {
          title: "CDC STI Information",
          description: "Comprehensive information about different types of STIs, symptoms, and treatment options"
        },
        {
          title: "Local Testing Centers",
          description: "Find confidential and affordable STI testing locations near you"
        },
        {
          title: "STI Prevention Guide",
          description: "Learn about different prevention methods and how to protect yourself and your partners"
        }
      ],
      tips: [
        "Get tested regularly if you're sexually active",
        "Use barrier methods like condoms consistently",
        "Have honest conversations with partners about STI status",
        "Don't assume someone's STI status based on appearance",
        "Seek medical attention if you notice unusual symptoms"
      ],
      getHelp: "If you need STI testing, treatment, or have questions, contact your healthcare provider or visit a local clinic. Many areas offer free or low-cost confidential testing."
    }
  },
  {
    id: "contraception",
    icon: Heart,
    title: "Contraception & Pregnancy",
    description: "Make informed family planning decisions",
    detailedContent: {
      overview: "Understanding contraception options and pregnancy planning helps you make informed decisions about your reproductive health and future. There are many effective methods available to suit different needs and preferences.",
      keyPoints: [
        "Multiple contraceptive methods are available with different effectiveness rates",
        "Consider your lifestyle, health conditions, and preferences when choosing",
        "Emergency contraception is available if regular contraception fails",
        "Pregnancy planning involves preparing both physically and emotionally",
        "Healthcare providers can help you choose the best option for you"
      ],
      resources: [
        {
          title: "Contraception Comparison Tool",
          description: "Compare different contraceptive methods, their effectiveness, and side effects"
        },
        {
          title: "Pregnancy Planning Guide",
          description: "Information about preparing for pregnancy, including nutrition and health recommendations"
        },
        {
          title: "Emergency Contraception Information",
          description: "Learn about emergency contraception options and when to use them"
        }
      ],
      tips: [
        "Discuss contraception options with a healthcare provider",
        "Consider both effectiveness and convenience when choosing a method",
        "Have a backup plan in case your primary method fails",
        "Take prenatal vitamins if you're planning to become pregnant",
        "Track your menstrual cycle to better understand your fertility"
      ],
      getHelp: "Consult with healthcare providers, family planning clinics, or reproductive health specialists for personalized guidance on contraception and pregnancy planning."
    }
  },
  {
    id: "consent",
    icon: Users,
    title: "Consent, Boundaries & Rights",
    description: "Understand your rights and respect others",
    detailedContent: {
      overview: "Consent is the foundation of healthy relationships and sexual experiences. Understanding consent, setting boundaries, and knowing your rights helps create respectful interactions and protects everyone involved.",
      keyPoints: [
        "Consent must be freely given, ongoing, and can be withdrawn at any time",
        "Clear communication about boundaries is essential in all relationships",
        "Everyone has the right to say no at any time, regardless of circumstances",
        "Consent cannot be given when someone is intoxicated or coerced",
        "Respecting others' boundaries shows care and builds trust"
      ],
      resources: [
        {
          title: "Understanding Consent",
          description: "Comprehensive guide to what consent means and how to practice it"
        },
        {
          title: "Setting Healthy Boundaries",
          description: "Learn how to communicate your limits and respect others' boundaries"
        },
        {
          title: "Know Your Rights",
          description: "Information about your rights in relationships and sexual situations"
        }
      ],
      tips: [
        "Communicate your boundaries clearly and early in relationships",
        "Check in with partners during intimate moments",
        "Respect when someone says no without arguing or pressuring",
        "Remember that consent to one activity doesn't mean consent to all",
        "Trust your instincts if something doesn't feel right"
      ],
      getHelp: "If you need support with boundary-setting, relationship issues, or have experienced violations of consent, reach out to counselors, support groups, or trusted adults."
    }
  },
  {
    id: "safe-sex",
    icon: CheckCircle,
    title: "Safe Sex & Informed Decisions",
    description: "Practice safer sexual behaviors",
    detailedContent: {
      overview: "Safe sex practices help protect you and your partners from STIs and unintended pregnancies. Making informed decisions about sexual activity involves understanding risks, protection methods, and your personal values.",
      keyPoints: [
        "Barrier methods like condoms provide protection against STIs and pregnancy",
        "Communication with partners about sexual history and expectations is important",
        "Regular testing allows you to know your STI status",
        "Understanding your own values and limits guides decision-making",
        "Safe sex is about reducing risks, not eliminating all intimacy"
      ],
      resources: [
        {
          title: "Safe Sex Practices Guide",
          description: "Comprehensive information about protection methods and risk reduction"
        },
        {
          title: "Communication Skills for Sexual Health",
          description: "Tips for having conversations about sexual health with partners"
        },
        {
          title: "Decision-Making Framework",
          description: "Tools to help you make informed choices about sexual activity"
        }
      ],
      tips: [
        "Always use protection during sexual activity",
        "Get tested regularly and encourage partners to do the same",
        "Have honest conversations about sexual health before intimacy",
        "Don't feel pressured to engage in activities you're not comfortable with",
        "Keep emergency contraception accessible if you're sexually active"
      ],
      getHelp: "Healthcare providers, counselors, and sexual health educators can provide guidance on safe sex practices and help you make informed decisions about your sexual health."
    }
  },
  {
    id: "substance-use",
    icon: AlertTriangle,
    title: "Substance Use & Sexual Health",
    description: "Understand the risks and connections",
    detailedContent: {
      overview: "Substance use can significantly impact sexual health and decision-making. Understanding these connections helps you make safer choices and recognize when substance use might be affecting your sexual health and relationships.",
      keyPoints: [
        "Alcohol and drugs can impair judgment and consent capacity",
        "Substance use increases the risk of unprotected sex and STI transmission",
        "Some substances can directly affect sexual function and health",
        "Addiction can impact relationships and sexual well-being",
        "Recovery resources are available for those struggling with substance use"
      ],
      resources: [
        {
          title: "Substance Use and Sexual Risk",
          description: "Information about how different substances affect sexual behavior and health"
        },
        {
          title: "Harm Reduction Strategies",
          description: "Practical tips for reducing risks when substance use occurs"
        },
        {
          title: "Addiction Recovery Resources",
          description: "Support services and treatment options for substance use disorders"
        }
      ],
      tips: [
        "Avoid making sexual decisions while under the influence",
        "Have protection easily accessible before drinking or using substances",
        "Create a safety plan with trusted friends when going out",
        "Be aware of drink spiking and other safety risks",
        "Seek help if substance use is affecting your relationships or health"
      ],
      getHelp: "If substance use is affecting your sexual health or relationships, contact addiction counselors, healthcare providers, or substance abuse treatment centers for support and resources."
    }
  },
  {
    id: "digital-safety",
    icon: Smartphone,
    title: "Digital Safety in Relationships",
    description: "Navigate online relationships safely",
    detailedContent: {
      overview: "Digital platforms are increasingly part of how we meet people and maintain relationships. Understanding online safety, privacy, and healthy digital boundaries helps protect you from risks while enjoying the benefits of digital connection.",
      keyPoints: [
        "Protect your personal information when meeting people online",
        "Be cautious about sharing intimate images or content",
        "Recognize signs of online manipulation or abuse",
        "Understand privacy settings on social platforms and dating apps",
        "Digital harassment and stalking are serious issues that require intervention"
      ],
      resources: [
        {
          title: "Online Dating Safety Tips",
          description: "Guidelines for staying safe when meeting people through dating apps and websites"
        },
        {
          title: "Digital Privacy Protection",
          description: "How to protect your personal information and intimate content online"
        },
        {
          title: "Recognizing Digital Abuse",
          description: "Signs of online harassment, stalking, and manipulation in relationships"
        }
      ],
      tips: [
        "Meet new people in public places for first dates",
        "Don't share personal information like home address or workplace early on",
        "Be cautious about sharing intimate photos or videos",
        "Trust your instincts if someone's online behavior seems suspicious",
        "Keep evidence of harassment or threatening behavior"
      ],
      getHelp: "If you experience digital harassment, stalking, or abuse, contact law enforcement, victim services organizations, or platforms' safety teams for support and intervention."
    }
  },
  {
    id: "sexual-violence",
    icon: Users,
    title: "Preventing Sexual Violence",
    description: "Recognize and prevent harmful situations",
    detailedContent: {
      overview: "Sexual violence prevention involves understanding consent, recognizing warning signs, and knowing how to intervene safely. Everyone plays a role in creating safer communities and supporting survivors.",
      keyPoints: [
        "Sexual violence is never the victim's fault",
        "Bystander intervention can prevent harmful situations",
        "Warning signs of potential perpetrators can be recognized",
        "Survivors deserve support, not judgment",
        "Prevention education benefits entire communities"
      ],
      resources: [
        {
          title: "Bystander Intervention Training",
          description: "Learn safe and effective ways to intervene when you see concerning behavior"
        },
        {
          title: "Supporting Survivors",
          description: "How to provide appropriate support to someone who has experienced sexual violence"
        },
        {
          title: "Prevention Strategies",
          description: "Community-based approaches to preventing sexual violence"
        }
      ],
      tips: [
        "Learn to recognize and interrupt situations that could lead to harm",
        "Believe and support friends who disclose experiences of sexual violence",
        "Challenge attitudes and behaviors that contribute to sexual violence",
        "Know how to access help and resources in your community",
        "Model respectful behavior in your own relationships"
      ],
      getHelp: "If you or someone you know has experienced sexual violence, contact local victim services, the national sexual assault hotline (1-800-656-HOPE), or campus resources for confidential support."
    }
  },
  {
    id: "healthy-relationships",
    icon: Handshake,
    title: "Building Healthy Relationships",
    description: "Foster respectful and supportive connections",
    detailedContent: {
      overview: "Healthy relationships are built on mutual respect, trust, communication, and support. Understanding the characteristics of healthy relationships helps you build better connections and recognize when relationships may be unhealthy.",
      keyPoints: [
        "Healthy relationships involve mutual respect and equality",
        "Good communication includes both talking and listening",
        "Trust is built over time through consistent, reliable behavior",
        "Both partners maintain their individual identities and interests",
        "Conflict is handled constructively without abuse or manipulation"
      ],
      resources: [
        {
          title: "Relationship Communication Skills",
          description: "Techniques for effective communication and conflict resolution in relationships"
        },
        {
          title: "Red Flags in Relationships",
          description: "Warning signs of unhealthy or abusive relationship patterns"
        },
        {
          title: "Building Trust and Intimacy",
          description: "How to develop deeper connections and emotional intimacy with partners"
        }
      ],
      tips: [
        "Practice active listening when your partner shares concerns",
        "Maintain friendships and interests outside of romantic relationships",
        "Address conflicts directly rather than avoiding them",
        "Show appreciation and gratitude regularly",
        "Respect your partner's boundaries and expect the same in return"
      ],
      getHelp: "If you're struggling with relationship issues or recognizing unhealthy patterns, consider couples counseling, individual therapy, or relationship education programs."
    }
  }
];
