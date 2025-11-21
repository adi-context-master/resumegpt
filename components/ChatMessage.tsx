type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;
};

type ChatMessageProps = {
  message: Message;
};

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div
      className={`py-6 ${
        isUser ? 'bg-chat-bg' : 'bg-assistant-bubble'
      }`}
    >
      <div className="max-w-3xl mx-auto px-6 flex gap-6">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div
            className={`w-8 h-8 rounded-sm flex items-center justify-center text-sm font-semibold ${
              isUser
                ? 'bg-chat-accent text-white'
                : 'bg-chat-accent text-white'
            }`}
          >
            {isUser ? 'U' : 'A'}
          </div>
        </div>

        {/* Message content */}
        <div className="flex-1 overflow-hidden">
          <div className="text-chat-text prose prose-invert max-w-none">
            {message.content.split('\n').map((line, idx) => {
              // Empty line
              if (!line.trim()) {
                return <br key={idx} />;
              }

              // Bullet point
              if (line.trim().startsWith('•')) {
                const content = line.trim().substring(1).trim();
                const parts = content.split(/(\*\*[^*]+\*\*)/g);

                return (
                  <div key={idx} className="flex gap-2 mb-2">
                    <span className="text-chat-accent">•</span>
                    <span className="flex-1">
                      {parts.map((part, partIdx) => {
                        if (part.startsWith('**') && part.endsWith('**')) {
                          return (
                            <strong key={partIdx} className="font-semibold">
                              {part.slice(2, -2)}
                            </strong>
                          );
                        }
                        return <span key={partIdx}>{part}</span>;
                      })}
                    </span>
                  </div>
                );
              }

              // Regular line with bold markdown
              const parts = line.split(/(\*\*[^*]+\*\*)/g);

              return (
                <p key={idx} className={idx > 0 ? 'mt-2' : ''}>
                  {parts.map((part, partIdx) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                      return (
                        <strong key={partIdx} className="font-semibold text-chat-text">
                          {part.slice(2, -2)}
                        </strong>
                      );
                    }
                    return <span key={partIdx}>{part}</span>;
                  })}
                </p>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export type { Message };
