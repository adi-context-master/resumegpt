import { CvData, ExperienceItem } from '@/data/cvData';

type RelevantSection = {
  section: string;
  content: string;
  score: number;
};

type SearchResult = {
  relevantSections: RelevantSection[];
  answer: string;
};

function normalizeText(text: string): string {
  return text.toLowerCase().trim();
}

function calculateScore(text: string, keywords: string[]): number {
  const normalizedText = normalizeText(text);
  let score = 0;

  keywords.forEach(keyword => {
    const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
    const matches = normalizedText.match(regex);
    if (matches) {
      score += matches.length;
    }
  });

  return score;
}

function formatExperience(exp: ExperienceItem): string {
  return `**${exp.role}** at ${exp.company} (${exp.location})\n${exp.start} - ${exp.end}\n\n${exp.bullets.map(b => `• ${b}`).join('\n')}`;
}

export function answerQuestion(query: string, cvData: CvData): SearchResult {
  const normalizedQuery = normalizeText(query);
  const keywords = normalizedQuery
    .split(/\s+/)
    .filter(word => word.length > 2); // Filter out short words

  if (keywords.length === 0) {
    return {
      relevantSections: [],
      answer: "I can only answer based on Aditya's CV. Please ask a more specific question about his experience, skills, education, or background in cards, payments, or RegTech."
    };
  }

  const sections: RelevantSection[] = [];

  // Check for greeting patterns
  const greetings = ['hi', 'hello', 'hey', 'greetings'];
  if (greetings.some(g => normalizedQuery.includes(g)) && normalizedQuery.split(' ').length <= 3) {
    return {
      relevantSections: [],
      answer: "Hi! I'm Aditya's AI CV assistant. What would you like to know about Aditya? You can ask about his experience in cards & payments, RegTech, AI projects, skills, or education."
    };
  }

  // Score summary
  const summaryScore = calculateScore(cvData.summary, keywords);
  if (summaryScore > 0) {
    sections.push({
      section: 'summary',
      content: cvData.summary,
      score: summaryScore
    });
  }

  // Score headline
  const headlineScore = calculateScore(cvData.headline, keywords);
  if (headlineScore > 0) {
    sections.push({
      section: 'headline',
      content: cvData.headline,
      score: headlineScore
    });
  }

  // Score key value proposition
  cvData.keyValueProposition.forEach((kvp, index) => {
    const score = calculateScore(kvp, keywords);
    if (score > 0) {
      sections.push({
        section: `value_proposition_${index}`,
        content: kvp,
        score
      });
    }
  });

  // Score experience
  cvData.experience.forEach(exp => {
    const expText = `${exp.role} ${exp.company} ${exp.bullets.join(' ')}`;
    const score = calculateScore(expText, keywords);
    if (score > 0) {
      sections.push({
        section: `experience_${exp.company}`,
        content: formatExperience(exp),
        score
      });
    }
  });

  // Score skills
  const skillsText = cvData.keySkills.join(' ');
  const skillsScore = calculateScore(skillsText, keywords);
  if (skillsScore > 0) {
    sections.push({
      section: 'skills',
      content: cvData.keySkills.join('\n• '),
      score: skillsScore
    });
  }

  // Score education
  cvData.education.forEach(edu => {
    const eduText = `${edu.institution} ${edu.degree} ${edu.location}`;
    const score = calculateScore(eduText, keywords);
    if (score > 0) {
      sections.push({
        section: `education_${edu.institution}`,
        content: `**${edu.degree}**\n${edu.institution}, ${edu.location}\n${edu.years}`,
        score
      });
    }
  });

  // Sort by score
  sections.sort((a, b) => b.score - a.score);

  // Generate answer based on top sections
  if (sections.length === 0) {
    return {
      relevantSections: [],
      answer: "I can only answer based on Aditya's CV. I couldn't find anything directly related to your question. Try asking about his roles, skills, education, or experience in cards, payments, or RegTech."
    };
  }

  // Generate contextual answer
  const answer = generateAnswer(normalizedQuery, sections, cvData);

  return {
    relevantSections: sections.slice(0, 5), // Return top 5
    answer
  };
}

function generateAnswer(query: string, sections: RelevantSection[], cvData: CvData): string {
  const topSection = sections[0];

  // Experience-related questions
  if (query.includes('experience') || query.includes('work') || query.includes('job') ||
      query.includes('role') || query.includes('barclays') || query.includes('auto') ||
      query.includes('qonto') || query.includes('product') || query.includes('career') ||
      query.includes('position') || query.includes('companies') || query.includes('worked')) {

    const expSections = sections.filter(s => s.section.startsWith('experience_'));

    if (expSections.length > 0) {
      let answer = `Aditya has 10+ years of experience delivering high-impact technology products across fintech and banking in Europe. Here are his key roles:\n\n`;

      expSections.slice(0, 3).forEach(sec => {
        answer += sec.content + '\n\n';
      });

      return answer.trim();
    }
  }

  // Skills-related questions
  if (query.includes('skill') || query.includes('tech') || query.includes('tool') ||
      query.includes('know') || query.includes('can') || query.includes('regulation') ||
      query.includes('api') || query.includes('kafka') || query.includes('payment') ||
      query.includes('expertise') || query.includes('proficient') || query.includes('abilities') ||
      query.includes('regtech') || query.includes('card') || query.includes('sepa') ||
      query.includes('kyc') || query.includes('aml') || query.includes('compliance') ||
      query.includes('microservices') || query.includes('architecture')) {

    // Always return skills for skill-related queries
    return `Aditya has extensive technical and domain expertise across multiple areas:\n\n• ${cvData.keySkills.join('\n• ')}`;
  }

  // Education-related questions
  if (query.includes('education') || query.includes('degree') || query.includes('university') ||
      query.includes('study') || query.includes('studied') || query.includes('school') ||
      query.includes('master') || query.includes('bachelor') || query.includes('academic') ||
      query.includes('polytechnique') || query.includes('delhi')) {

    // Always return education info for education-related queries
    let answer = `Aditya has a strong educational background with degrees from prestigious institutions:\n\n`;

    cvData.education.forEach(edu => {
      answer += `**${edu.degree}**\n${edu.institution}, ${edu.location} (${edu.years})\n\n`;
    });

    return answer.trim();
  }

  // Contact-related questions
  if (query.includes('contact') || query.includes('email') || query.includes('phone') ||
      query.includes('reach') || query.includes('address')) {
    return `You can reach Aditya at:\n\n• Email: ${cvData.contact.email}\n• Phone: ${cvData.contact.phone}\n• Location: ${cvData.contact.address}`;
  }

  // Location-related questions
  if (query.includes('where') || query.includes('location') || query.includes('based') || query.includes('live')) {
    return `Aditya is currently based in ${cvData.contact.address}. He has worked across multiple European cities including Hamburg (Barclays), Berlin (Auto1), and Paris (Qonto, Ecole Polytechnique).`;
  }

  // AI and emerging tech questions
  if (query.includes('ai') || query.includes('artificial intelligence') ||
      query.includes('emerging') || query.includes('pivot') || query.includes('transition')) {
    return `Aditya is pivoting into AI-driven project leadership, bringing his 10+ years of fintech experience to emerging technologies.\n\n**Key AI & Tech Capabilities:**\n• ${cvData.keyValueProposition[0]}\n• ${cvData.keyValueProposition[2]}\n• ${cvData.keyValueProposition[3]}\n\nHe's seeking to apply his strategic thinking, cross-functional coordination, and hands-on approach to fast-paced, high-stakes initiatives in AI and emerging technologies.`;
  }

  // Value proposition questions
  if (query.includes('strength') || query.includes('value') || query.includes('proposition') ||
      query.includes('what makes') || query.includes('why hire') || query.includes('unique')) {
    return `Aditya's key value propositions:\n\n• ${cvData.keyValueProposition.join('\n• ')}`;
  }

  // General/summary questions
  if (query.includes('who') || query.includes('about') || query.includes('summary') ||
      query.includes('background') || query.includes('tell me') || query.includes('overview')) {
    return `${cvData.summary}\n\n**Headline:** ${cvData.headline}\n\n**Key Strengths:**\n• ${cvData.keyValueProposition.slice(0, 3).join('\n• ')}`;
  }

  // Banking/Fintech domain questions
  if (query.includes('fintech') || query.includes('banking') || query.includes('financial')) {
    return `Aditya has 10+ years of specialized experience in fintech and digital banking:\n\n${cvData.experience.map(exp =>
      `**${exp.company}** (${exp.location})\n${exp.role}, ${exp.start} - ${exp.end}`
    ).join('\n\n')}\n\nHis work spans cards & payments, RegTech compliance, cross-border banking integration, and digital wallet solutions across Europe.`;
  }

  // Product management specific questions
  if (query.includes('product manager') || query.includes('product owner') ||
      query.includes('agile') || query.includes('scrum') || query.includes('okr')) {
    return `Aditya is an accomplished Product Leader with expertise in:\n\n• End-to-End Product Ownership: From discovery and vision to KPIs and delivery across B2B and B2C environments\n• Product & Agile: OKRs, Agile/Scrum, Discovery → Delivery → Optimization\n• Cross-Functional Leadership: Bridge between tech, business, legal, and compliance teams\n\nHis product management experience includes leading card platforms, digital wallets, and payment systems at Barclays, Auto1, and Qonto.`;
  }

  // Company-specific questions
  if (query.includes('barclays')) {
    const barclays = cvData.experience.find(e => e.company === 'Barclays Bank');
    if (barclays) {
      return `At Barclays Bank in Hamburg, Germany, Aditya currently serves as ${barclays.role} (${barclays.start} - ${barclays.end}).\n\n**Key Responsibilities:**\n${barclays.bullets.map(b => `• ${b}`).join('\n')}`;
    }
  }

  if (query.includes('auto1') || query.includes('auto 1')) {
    const auto1 = cvData.experience.find(e => e.company === 'Auto 1');
    if (auto1) {
      return `At Auto1 in Berlin, Aditya worked as ${auto1.role} from ${auto1.start} to ${auto1.end}.\n\n**Key Achievements:**\n${auto1.bullets.map(b => `• ${b}`).join('\n')}`;
    }
  }

  if (query.includes('qonto')) {
    const qonto = cvData.experience.find(e => e.company === 'Qonto');
    if (qonto) {
      return `At Qonto in Paris, Aditya was a ${qonto.role} from ${qonto.start} to ${qonto.end}.\n\n**Key Achievements:**\n${qonto.bullets.map(b => `• ${b}`).join('\n')}`;
    }
  }

  // Default: return top section with context
  if (topSection.section.startsWith('experience_')) {
    return `Based on Aditya's experience:\n\n${topSection.content}`;
  } else if (topSection.section === 'skills') {
    return `Aditya's relevant skills include:\n\n• ${topSection.content}`;
  } else if (topSection.section.startsWith('education_')) {
    return `Regarding Aditya's education:\n\n${topSection.content}`;
  } else {
    return topSection.content;
  }
}
