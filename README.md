# Aditya's AI CV Assistant

A ChatGPT-inspired personal website that lets visitors ask questions about Aditya Pratap Singh's professional background, experience, skills, and education.

## Features

- **ChatGPT-style UI**: Dark theme with left sidebar, chat bubbles, and smooth interactions
- **Intelligent Search**: Client-side keyword-based search that understands context
- **Comprehensive CV Data**: Complete information about experience, skills, and education
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **No Backend Required**: All data processing happens in the browser

## Tech Stack

- **Next.js 14** (App Router)
- **React 18**
- **TypeScript**
- **Tailwind CSS**
- Client-side search (no external APIs)

## Getting Started

### Prerequisites

- Node.js 18+ installed on your machine
- npm or yarn package manager

### Installation

1. **Install dependencies:**

```bash
npm install
```

2. **Run the development server:**

```bash
npm run dev
```

3. **Open your browser:**

Navigate to [http://localhost:3000](http://localhost:3000)

You should see the AI CV assistant ready to answer questions about Aditya!

## Project Structure

```
Adiweb/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Main chat page
│   └── globals.css         # Global styles and Tailwind imports
├── components/
│   ├── ChatLayout.tsx      # Layout with sidebar and main area
│   ├── ChatMessage.tsx     # Individual message bubble component
│   └── ChatInput.tsx       # Message input field with send button
├── data/
│   └── cvData.ts           # Aditya's CV data structure
├── lib/
│   └── searchCv.ts         # Search and answer generation logic
├── tailwind.config.ts      # Tailwind configuration with ChatGPT colors
├── tsconfig.json           # TypeScript configuration
├── next.config.js          # Next.js configuration
└── package.json            # Project dependencies
```

## Building for Production

```bash
npm run build
npm start
```

This creates an optimized production build and starts the production server.

## Customization

### Updating CV Data

Edit `/data/cvData.ts` to update Aditya's information:

- Basic contact information
- Work experience
- Skills
- Education
- Summary and value propositions

### Changing Colors

Modify `/tailwind.config.ts` to adjust the color scheme:

```typescript
colors: {
  'chat-bg': '#343541',        // Main background
  'sidebar-bg': '#202123',     // Sidebar background
  'chat-accent': '#10A37F',    // Accent color (green)
  // ... other colors
}
```

### Improving Search Logic

Enhance the search algorithm in `/lib/searchCv.ts`:

- Add more keyword patterns
- Improve answer generation
- Add fuzzy matching
- Implement more sophisticated ranking

## Example Questions

Try asking:

- "What is Aditya's experience?"
- "Tell me about his skills"
- "Where did Aditya study?"
- "What does he do at Barclays?"
- "What are his RegTech skills?"
- "Tell me about his work in cards and payments"

## License

This project is for personal use.

## Contact

For questions about this project or Aditya's background:
- Email: aps270195@gmail.com
- Phone: +49 160 8220604
# resumegpt
# resumegpt
