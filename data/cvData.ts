export type ExperienceItem = {
  company: string;
  location: string;
  role: string;
  start: string;
  end: string;
  bullets: string[];
};

export type EducationItem = {
  institution: string;
  degree: string;
  location: string;
  years: string;
};

export type CvData = {
  name: string;
  contact: {
    phone: string;
    email: string;
    address: string;
  };
  headline: string;
  summary: string;
  keyValueProposition: string[];
  experience: ExperienceItem[];
  keySkills: string[];
  education: EducationItem[];
};

export const cvData: CvData = {
  name: "Aditya Pratap Singh",
  contact: {
    phone: "+49 160 8220604",
    email: "aps270195@gmail.com",
    address: "Ansgar Strasse 96A, Elmshorn 25336, Germany"
  },
  headline: "Senior Product Owner – Cards & Accounts | Digital Banking Innovator | RegTech Expert",
  summary: "Accomplished Product Leader with 10+ years of experience delivering high-impact technology products across fintech and banking in Europe. Skilled in managing complex, regulated domains (Cards, KYC/AML, SEPA) with an agile, delivery-focused mindset. Now seeking to pivot into AI-driven project leadership, bringing strategic thinking, cross-functional coordination, and a hands-on approach to fast-paced, high-stakes initiatives in emerging technologies.",
  keyValueProposition: [
    "AI & Emerging Tech Delivery: Strategic planning and execution of complex product initiatives with fast prototyping using APIs and no-code/low-code tools.",
    "Cross-Functional Leadership: Bridge between tech, business, legal, and compliance teams across geographies.",
    "End-to-End Product Ownership: From discovery and vision to KPIs and delivery across B2B and B2C environments.",
    "Technical Acumen: REST APIs, Kafka, ISO 20022, Microservices; confident navigating systems and architecture discussions.",
    "Data-Informed Decisions: SQL, Power BI, Snowflake; metric-driven product optimizations.",
    "Regulatory & Risk Oversight: Deep exposure to PSD2, GDPR, BaFin, KYC/AML protocols."
  ],
  experience: [
    {
      company: "Barclays Bank",
      location: "Hamburg, Germany",
      role: "Assistant Vice President - Cards",
      start: "September 2023",
      end: "Present",
      bullets: [
        "Driving cross-border integration of card systems between UK & Germany with full regulatory alignment.",
        "Introduced scalable product enhancements using customer behavior analytics for fraud detection and journey personalization.",
        "Coordinated with legal, IT, and compliance to implement interoperability frameworks for seamless digital banking."
      ]
    },
    {
      company: "Auto 1",
      location: "Berlin, Germany",
      role: "Product Manager - Cards",
      start: "April 2022",
      end: "August 2023",
      bullets: [
        "Owned the digital wallet and cards domain – from vendor acquisition to feature roadmap execution.",
        "Deployed Kafka-based real-time event queues, enabling 30% faster authorization and reconciliation cycles.",
        "Refactored legacy integrations into modular microservices, improving system scalability and maintainability."
      ]
    },
    {
      company: "Qonto",
      location: "Paris, France",
      role: "Product Manager - Cards",
      start: "April 2019",
      end: "March 2022",
      bullets: [
        "Delivered SEPA middleware and API-based integration for 3rd-party KYC/AML tools across France, Germany, and Spain.",
        "Launched new platinum cards and increased Cards ARPU and Decline rate.",
        "Owned product KPIs, including SLA adherence, error rates, and latency for real-time payment networks."
      ]
    }
  ],
  keySkills: [
    "Cards & Payments: Authorization, 3DS/OOB, Card Restrictions, Lifecycle, Tokenization, Settlement",
    "RegTech: KYC, AML, SEPA, ISO 20022, GDPR, PSD2, SWIFT, BaFin compliance",
    "Systems & Architecture: REST APIs, Kafka, Microservices, Message Queues",
    "Data & Tools: SQL, Snowflake, Power BI, Jira, Confluence",
    "Product & Agile: OKRs, Agile/Scrum, Discovery → Delivery → Optimization",
    "B2B & B2C Payment Ecosystems (SEPA, MT940, camt.052)"
  ],
  education: [
    {
      institution: "Ecole Polytechnique",
      location: "Paris, France",
      degree: "Master of Science and Technology: Internet of Things",
      years: "2017 – 2019"
    },
    {
      institution: "University of Delhi",
      location: "Delhi, India",
      degree: "Bachelors of Technology: Computer Science",
      years: "2013 – 2017"
    }
  ]
};
