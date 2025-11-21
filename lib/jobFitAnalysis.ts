import { CvData } from '@/data/cvData';

interface SkillMatch {
  skill: string;
  found: boolean;
  evidence?: string;
}

interface FitAnalysisResult {
  overallFit: number; // 0-100
  matchedSkills: SkillMatch[];
  matchedExperience: string[];
  gaps: string[];
  recommendations: string;
}

function normalizeText(text: string): string {
  return text.toLowerCase().trim();
}

function extractKeywords(jobDescription: string): string[] {
  const normalized = normalizeText(jobDescription);

  // Common tech and domain keywords to look for
  const techKeywords = [
    'api', 'rest', 'kafka', 'microservices', 'sql', 'snowflake', 'power bi',
    'jira', 'confluence', 'agile', 'scrum', 'okr', 'product management',
    'cards', 'payments', 'banking', 'fintech', 'regtech', 'kyc', 'aml',
    'sepa', 'iso 20022', 'gdpr', 'psd2', 'swift', 'bafin', '3ds', 'tokenization',
    'authorization', 'settlement', 'compliance', 'regulatory', 'digital banking',
    'b2b', 'b2c', 'payment systems', 'fraud detection', 'real-time', 'event queues',
    'cross-border', 'integration', 'digital wallet', 'vendor management',
    'product owner', 'product manager', 'kpi', 'sla', 'roadmap', 'discovery',
    'delivery', 'optimization', 'stakeholder', 'leadership', 'cross-functional',
    'technical', 'architecture', 'scalability', 'performance', 'security'
  ];

  const foundKeywords = techKeywords.filter(keyword =>
    normalized.includes(keyword)
  );

  return foundKeywords;
}

function checkSkillMatch(skill: string, cvData: CvData): SkillMatch {
  const normalizedSkill = normalizeText(skill);

  // Check in key skills
  const skillFound = cvData.keySkills.some(cvSkill =>
    normalizeText(cvSkill).includes(normalizedSkill) ||
    normalizedSkill.includes(normalizeText(cvSkill))
  );

  if (skillFound) {
    const matchedSkill = cvData.keySkills.find(cvSkill =>
      normalizeText(cvSkill).includes(normalizedSkill) ||
      normalizedSkill.includes(normalizeText(cvSkill))
    );
    return {
      skill,
      found: true,
      evidence: matchedSkill
    };
  }

  // Check in experience bullets
  for (const exp of cvData.experience) {
    for (const bullet of exp.bullets) {
      if (normalizeText(bullet).includes(normalizedSkill)) {
        return {
          skill,
          found: true,
          evidence: `${exp.company}: ${bullet.substring(0, 100)}...`
        };
      }
    }
  }

  return {
    skill,
    found: false
  };
}

function findRelevantExperience(jobDescription: string, cvData: CvData): string[] {
  const normalized = normalizeText(jobDescription);
  const relevantExp: string[] = [];

  // Check for cards/payments mention
  if (normalized.includes('card') || normalized.includes('payment')) {
    relevantExp.push('10+ years in Cards & Payments across Barclays, Auto1, and Qonto');
  }

  // Check for banking/fintech
  if (normalized.includes('banking') || normalized.includes('fintech') || normalized.includes('financial')) {
    relevantExp.push('Extensive digital banking experience across European markets (UK, Germany, France, Spain)');
  }

  // Check for product management
  if (normalized.includes('product manager') || normalized.includes('product owner') || normalized.includes('product lead')) {
    relevantExp.push('Product Manager/Leader with end-to-end ownership of digital wallet and card platforms');
  }

  // Check for regulatory/compliance
  if (normalized.includes('regtech') || normalized.includes('compliance') || normalized.includes('regulatory') ||
      normalized.includes('kyc') || normalized.includes('aml')) {
    relevantExp.push('Deep RegTech expertise: KYC, AML, GDPR, PSD2, BaFin compliance');
  }

  // Check for cross-border
  if (normalized.includes('cross-border') || normalized.includes('international')) {
    relevantExp.push('Led cross-border integration of card systems between UK & Germany');
  }

  // Check for technical leadership
  if (normalized.includes('technical') || normalized.includes('architect') || normalized.includes('system')) {
    relevantExp.push('Technical leadership in microservices, Kafka, APIs, and scalable architecture');
  }

  return relevantExp;
}

function identifyGaps(keywords: string[], cvData: CvData): string[] {
  const gaps: string[] = [];
  const cvText = normalizeText(
    cvData.summary + ' ' +
    cvData.keySkills.join(' ') + ' ' +
    cvData.experience.map(e => e.bullets.join(' ')).join(' ')
  );

  keywords.forEach(keyword => {
    if (!cvText.includes(keyword)) {
      // Check for related terms
      const relatedTerms: { [key: string]: string[] } = {
        'python': ['java', 'javascript', 'programming'],
        'machine learning': ['ai', 'data analytics', 'behavior analytics'],
        'cloud': ['aws', 'azure', 'gcp', 'infrastructure'],
        'docker': ['containerization', 'microservices'],
        'kubernetes': ['orchestration', 'microservices']
      };

      const related = relatedTerms[keyword];
      if (related && related.some(term => cvText.includes(term))) {
        // Has related experience, not a hard gap
        return;
      }

      gaps.push(keyword);
    }
  });

  return gaps;
}

export function analyzeJobFit(jobDescription: string, cvData: CvData): string {
  const keywords = extractKeywords(jobDescription);
  const matchedSkills: SkillMatch[] = keywords.map(kw => checkSkillMatch(kw, cvData));
  const relevantExperience = findRelevantExperience(jobDescription, cvData);
  const gaps = identifyGaps(keywords, cvData);

  const matchedCount = matchedSkills.filter(s => s.found).length;
  const overallFit = keywords.length > 0 ? Math.round((matchedCount / keywords.length) * 100) : 0;

  // Generate analysis report
  let report = `# Job Fit Analysis for Aditya Pratap Singh\n\n`;

  // Overall fit score
  report += `## Overall Fit Score: ${overallFit}%\n\n`;

  if (overallFit >= 80) {
    report += `✅ **Excellent Match** - Aditya is an ideal candidate for this role.\n\n`;
  } else if (overallFit >= 60) {
    report += `✅ **Strong Match** - Aditya is a very good fit for this role with minor gaps.\n\n`;
  } else if (overallFit >= 40) {
    report += `⚠️ **Moderate Match** - Aditya has relevant experience but with some notable gaps.\n\n`;
  } else {
    report += `⚠️ **Limited Match** - This role may require skills outside Aditya's core expertise.\n\n`;
  }

  // Matched skills and experience
  if (matchedSkills.filter(s => s.found).length > 0) {
    report += `## ✅ Matched Qualifications\n\n`;
    report += `**Skills & Technologies:**\n`;
    matchedSkills.filter(s => s.found).forEach(skill => {
      report += `• ${skill.skill.toUpperCase()}`;
      if (skill.evidence) {
        report += ` - ${skill.evidence}`;
      }
      report += `\n`;
    });
    report += `\n`;
  }

  // Relevant experience
  if (relevantExperience.length > 0) {
    report += `**Relevant Experience:**\n`;
    relevantExperience.forEach(exp => {
      report += `• ${exp}\n`;
    });
    report += `\n`;
  }

  // Key highlights
  report += `## 🌟 Key Strengths\n\n`;
  cvData.keyValueProposition.slice(0, 3).forEach((kvp, i) => {
    report += `${i + 1}. ${kvp}\n`;
  });
  report += `\n`;

  // Current role
  const currentRole = cvData.experience[0];
  report += `## 💼 Current Position\n\n`;
  report += `**${currentRole.role}** at ${currentRole.company} (${currentRole.location})\n`;
  report += `${currentRole.start} - ${currentRole.end}\n\n`;
  report += `Key responsibilities:\n`;
  currentRole.bullets.slice(0, 3).forEach(bullet => {
    report += `• ${bullet}\n`;
  });
  report += `\n`;

  // Gaps if any
  if (gaps.length > 0 && gaps.length <= 5) {
    report += `## ⚠️ Potential Skill Gaps\n\n`;
    report += `The following skills mentioned in the job description were not explicitly found in Aditya's CV:\n`;
    gaps.forEach(gap => {
      report += `• ${gap}\n`;
    });
    report += `\n*Note: Aditya's strong technical foundation and proven ability to quickly learn new technologies may compensate for these gaps.*\n\n`;
  }

  // Recommendation
  report += `## 📋 Recommendation\n\n`;
  if (overallFit >= 70) {
    report += `**HIGHLY RECOMMENDED** - Aditya's extensive experience in fintech, cards & payments, and product leadership makes him an excellent candidate. His proven track record of delivering high-impact solutions across European markets, combined with deep RegTech knowledge and technical expertise, aligns well with the role requirements.\n\n`;
    report += `**Next Steps:**\n`;
    report += `• Schedule interview to discuss specific project requirements\n`;
    report += `• Review his cross-border integration and compliance work in detail\n`;
    report += `• Discuss his product leadership approach and stakeholder management experience\n`;
  } else if (overallFit >= 50) {
    report += `**RECOMMENDED** - Aditya has strong relevant experience and could be a good fit for this role. While there may be some skill gaps, his proven ability to learn quickly and deliver results across complex banking projects makes him worth considering.\n\n`;
    report += `**Next Steps:**\n`;
    report += `• Discuss specific technical requirements and skill gaps\n`;
    report += `• Assess cultural fit and team dynamics\n`;
    report += `• Review his learning agility and adaptability\n`;
  } else {
    report += `**CONSIDER WITH CAUTION** - While Aditya has solid experience in fintech and product management, this particular role may require skills significantly outside his current expertise. Consider whether training/onboarding can bridge the gaps.\n\n`;
  }

  // Contact information
  report += `## 📞 Contact Information\n\n`;
  report += `• **Email:** ${cvData.contact.email}\n`;
  report += `• **Phone:** ${cvData.contact.phone}\n`;
  report += `• **Location:** ${cvData.contact.address}\n`;

  return report;
}
