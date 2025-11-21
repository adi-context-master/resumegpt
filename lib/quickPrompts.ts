export type QuickPrompt = {
  id: string;
  label: string;
  query: string;
  icon: string;
  response: string;
};

export const QUICK_PROMPTS: QuickPrompt[] = [
  {
    id: 'experience',
    label: 'Experience',
    query: "Give me a concise overview of Aditya's work experience based on his CV. Include his roles, companies, locations, and time periods, especially in cards, payments, and digital banking.",
    icon: 'briefcase',
    response: `Aditya has 10+ years of experience delivering high-impact technology products across fintech and banking in Europe. Here are his key roles:

**Assistant Vice President - Cards** at Barclays Bank (Hamburg, Germany)
September 2023 - Present

• Driving cross-border integration of card systems between UK & Germany with full regulatory alignment.
• Introduced scalable product enhancements using customer behavior analytics for fraud detection and journey personalization.
• Coordinated with legal, IT, and compliance to implement interoperability frameworks for seamless digital banking.

**Product Manager - Cards** at Auto 1 (Berlin, Germany)
April 2022 - August 2023

• Owned the digital wallet and cards domain – from vendor acquisition to feature roadmap execution.
• Deployed Kafka-based real-time event queues, enabling 30% faster authorization and reconciliation cycles.
• Refactored legacy integrations into modular microservices, improving system scalability and maintainability.

**Product Manager - Cards** at Qonto (Paris, France)
April 2019 - March 2022

• Delivered SEPA middleware and API-based integration for 3rd-party KYC/AML tools across France, Germany, and Spain.
• Launched new platinum cards and increased Cards ARPU and Decline rate.
• Owned product KPIs, including SLA adherence, error rates, and latency for real-time payment networks.`
  },
  {
    id: 'skills',
    label: 'Skills',
    query: "What are Aditya's key skills and areas of expertise according to his CV? Summarise his strengths in cards & payments, RegTech, systems/architecture, data & tools, and product/agile.",
    icon: 'wrench',
    response: `Aditya has extensive technical and domain expertise across multiple areas:

• **Cards & Payments**: Authorization, 3DS/OOB, Card Restrictions, Lifecycle, Tokenization, Settlement

• **RegTech**: KYC, AML, SEPA, ISO 20022, GDPR, PSD2, SWIFT, BaFin compliance

• **Systems & Architecture**: REST APIs, Kafka, Microservices, Message Queues

• **Data & Tools**: SQL, Snowflake, Power BI, Jira, Confluence

• **Product & Agile**: OKRs, Agile/Scrum, Discovery → Delivery → Optimization

• **B2B & B2C Payment Ecosystems** (SEPA, MT940, camt.052)`
  },
  {
    id: 'education',
    label: 'Education',
    query: "Summarise Aditya's education based on his CV. Mention the degrees, universities, locations, and years.",
    icon: 'academic-cap',
    response: `Aditya has a strong educational background with degrees from prestigious institutions:

**Master of Science and Technology: Internet of Things**
Ecole Polytechnique, Paris, France (2017 – 2019)

**Bachelors of Technology: Computer Science**
University of Delhi, Delhi, India (2013 – 2017)`
  },
  {
    id: 'achievements',
    label: 'Achievements',
    query: "What are Aditya's key achievements and impact in his career?",
    icon: 'trophy',
    response: `Aditya has delivered significant business impact throughout his career:

**Business Impact**
• Enabled 30% faster authorization and reconciliation cycles through Kafka-based event queues
• Improved system scalability by refactoring legacy integrations into modular microservices
• Launched SEPA middleware and API integrations across France, Germany, and Spain
• Increased Cards ARPU and reduced decline rates through product optimization

**Technical Leadership**
• Led cross-border integration of card systems between UK & Germany with full regulatory compliance
• Implemented real-time fraud detection using customer behavior analytics
• Deployed interoperability frameworks for seamless digital banking experiences
• Owned critical product KPIs including SLA adherence, error rates, and payment network latency

**Strategic Initiatives**
• Drove vendor acquisition and feature roadmap execution for digital wallet and cards domain
• Coordinated with legal, IT, and compliance teams for regulatory frameworks (BaFin, GDPR, PSD2)
• Established product discovery to delivery optimization workflows using Agile/OKR methodologies`
  }
];

export function getQuickPromptById(id: string): QuickPrompt | undefined {
  return QUICK_PROMPTS.find(prompt => prompt.id === id);
}

export function getQuickPromptResponse(id: string): string | undefined {
  const prompt = getQuickPromptById(id);
  return prompt?.response;
}
