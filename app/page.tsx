'use client';

import { useState, useEffect, useRef } from 'react';
import ChatLayout from '@/components/ChatLayout';
import ChatMessage, { Message } from '@/components/ChatMessage';
import ChatInput from '@/components/ChatInput';
import { cvData } from '@/data/cvData';
import { answerQuestion } from '@/lib/searchCv';
import { getQuickPromptById } from '@/lib/quickPrompts';
import { analyzeJobFit } from '@/lib/jobFitAnalysis';

type RecentQuery = {
  id: string;
  query: string;
  timestamp: Date;
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [recentQueries, setRecentQueries] = useState<RecentQuery[]>([]);
  const [showJobModal, setShowJobModal] = useState(false);
  const [jobDescription, setJobDescription] = useState('');
  const [fitAnalysis, setFitAnalysis] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    // Add to recent queries (keep last 3)
    setRecentQueries((prev) => {
      const newQuery: RecentQuery = {
        id: Date.now().toString(),
        query: content,
        timestamp: new Date(),
      };
      const updated = [newQuery, ...prev];
      return updated.slice(0, 3);
    });

    // Check if the message matches a quick prompt keyword
    const normalizedContent = content.toLowerCase().trim();
    let quickPromptMatch = null;

    if (normalizedContent === 'experience' || normalizedContent === 'work experience') {
      quickPromptMatch = getQuickPromptById('experience');
    } else if (normalizedContent === 'skills' || normalizedContent === 'skill') {
      quickPromptMatch = getQuickPromptById('skills');
    } else if (normalizedContent === 'education' || normalizedContent === 'degree' || normalizedContent === 'degrees') {
      quickPromptMatch = getQuickPromptById('education');
    }

    // Generate assistant response
    setTimeout(() => {
      let responseContent: string;

      if (quickPromptMatch) {
        // Use pre-generated response for quick prompts
        responseContent = quickPromptMatch.response;
      } else {
        // Use regular search for other queries
        const searchResult = answerQuestion(content, cvData);
        responseContent = searchResult.answer;
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseContent,
        createdAt: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    }, 300); // Small delay to simulate "thinking"
  };

  const handleQuickPrompt = (promptId: string) => {
    const prompt = getQuickPromptById(promptId);
    if (!prompt) return;

    // Add user message with the query
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: prompt.query,
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    // Add assistant response with pre-generated answer
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: prompt.response,
        createdAt: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    }, 300);
  };

  const handleRecentQueryClick = (query: string) => {
    handleSendMessage(query);
  };

  const handleHomepage = () => {
    setMessages([]);
  };

  const handleJobAnalysis = () => {
    setShowJobModal(true);
  };

  const handleJobSubmit = () => {
    if (!jobDescription.trim()) return;

    // Analyze job fit based on CV data
    const analysis = analyzeJobFit(jobDescription, cvData);
    setFitAnalysis(analysis);
  };

  const handleCloseModal = () => {
    setShowJobModal(false);
    setJobDescription('');
    setFitAnalysis(null);
  };

  const handleDownloadCV = () => {
    // For now, we'll create a simple text-based CV download
    // In production, you'd integrate with a PDF library like jsPDF or pdfmake
    const cvContent = `
${cvData.name}
${cvData.contact.email} | ${cvData.contact.phone}
${cvData.contact.address}

${cvData.headline}

SUMMARY
${cvData.summary}

KEY VALUE PROPOSITION
${cvData.keyValueProposition.map((kvp, i) => `${i + 1}. ${kvp}`).join('\n')}

EXPERIENCE
${cvData.experience.map(exp => `
${exp.role} at ${exp.company} (${exp.location})
${exp.start} - ${exp.end}
${exp.bullets.map(b => `• ${b}`).join('\n')}
`).join('\n')}

KEY SKILLS
${cvData.keySkills.map(s => `• ${s}`).join('\n')}

EDUCATION
${cvData.education.map(edu => `
${edu.degree}
${edu.institution}, ${edu.location}
${edu.years}
`).join('\n')}
    `.trim();

    const blob = new Blob([cvContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Aditya_Pratap_Singh_CV.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <ChatLayout onQuickPrompt={handleQuickPrompt} onHomepage={handleHomepage}>
      {/* Header */}
      <div className="flex-shrink-0 border-b border-border-light py-3 px-6 bg-chat-bg">
        <div className="flex items-center justify-between">
          <div className="flex-1"></div>
          <h2 className="text-sm text-chat-muted">Aditya GPT</h2>
          <div className="flex-1 flex justify-end gap-3">
            {/* Download CV Button */}
            <button
              onClick={handleDownloadCV}
              className="group relative p-2 rounded-lg hover:bg-chat-accent/10 transition-colors"
              aria-label="Download CV"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-chat-accent">
                <path fillRule="evenodd" d="M12 2.25a.75.75 0 01.75.75v11.69l3.22-3.22a.75.75 0 111.06 1.06l-4.5 4.5a.75.75 0 01-1.06 0l-4.5-4.5a.75.75 0 111.06-1.06l3.22 3.22V3a.75.75 0 01.75-.75zm-9 13.5a.75.75 0 01.75.75v2.25a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5V16.5a.75.75 0 011.5 0v2.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V16.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
              </svg>
              {/* Tooltip */}
              <span className="absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                Generate a full CV PDF from this data
              </span>
            </button>

            {/* LinkedIn Icon */}
            <a
              href="https://www.linkedin.com/in/aditya270195/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg hover:bg-user-bubble transition-colors"
              aria-label="LinkedIn Profile"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-chat-text">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>

            {/* Phone Icon */}
            <a
              href={`tel:${cvData.contact.phone}`}
              className="p-2 rounded-lg hover:bg-user-bubble transition-colors"
              aria-label="Call"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-chat-text">
                <path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto flex flex-col">
        {messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center max-w-4xl px-6 w-full">
              <h1 className="text-5xl font-normal mb-8 text-chat-text">
                What do you want to know about Aditya?
              </h1>

              {/* Recent Queries */}
              {recentQueries.length > 0 && (
                <div className="mb-6">
                  <div className="text-xs font-semibold text-chat-muted uppercase tracking-wide mb-3">
                    Recent Queries
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {recentQueries.map((query) => (
                      <button
                        key={query.id}
                        onClick={() => handleRecentQueryClick(query.query)}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full text-sm text-chat-text transition-colors border border-gray-200 dark:border-gray-700"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-chat-accent">
                          <path fillRule="evenodd" d="M4.804 21.644A6.707 6.707 0 006 21.75a6.721 6.721 0 003.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 01-.814 1.686.75.75 0 00.44 1.223zM8.25 10.875a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25zM10.875 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875-1.125a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z" clipRule="evenodd" />
                        </svg>
                        <span className="truncate max-w-[200px]">{query.query}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Integrated Input */}
              <ChatInput
                onSend={handleSendMessage}
                showQuickPrompts={true}
                onQuickPrompt={handleQuickPrompt}
                onJobAnalysis={handleJobAnalysis}
              />
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input area for active chat */}
            <div className="flex-shrink-0">
              <ChatInput
                onSend={handleSendMessage}
                showQuickPrompts={false}
                onQuickPrompt={handleQuickPrompt}
                onJobAnalysis={handleJobAnalysis}
              />
            </div>
          </>
        )}
      </div>

      {/* Job Fit Analysis Modal */}
      {showJobModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Job Fit Analysis
              </h3>
              <button
                onClick={handleCloseModal}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Close modal"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-gray-500">
                  <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {!fitAnalysis ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Paste Job Description
                  </label>
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the job description here..."
                    className="w-full h-64 p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-chat-accent focus:border-transparent resize-none text-gray-900 dark:text-white dark:bg-gray-900"
                  />
                  <button
                    onClick={handleJobSubmit}
                    disabled={!jobDescription.trim()}
                    className="mt-4 w-full px-6 py-3 bg-chat-accent text-white rounded-lg hover:bg-chat-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    Analyze Fit
                  </button>
                </div>
              ) : (
                <div>
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <div className="whitespace-pre-wrap text-gray-900 dark:text-white">
                      {fitAnalysis}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setFitAnalysis(null);
                      setJobDescription('');
                    }}
                    className="mt-6 w-full px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
                  >
                    Analyze Another Job
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </ChatLayout>
  );
}
