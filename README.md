# RaagJournal: Personal Journaling Platform

RaagJournal is an open-source personal journaling application combining vintage newspaper aesthetics with modern design principles. Built with a carefully curated 70% Vintage Newspaper / 30% Modern Pop-Art design language, it delivers a sophisticated user experience for daily reflection and content creation.

![RaagJournal Hero](public/logo.png)

## Overview

RaagJournal provides a comprehensive journaling suite with integrated productivity tools. The platform merges editorial design patterns with contemporary web technologies to create a distraction-free writing environment enhanced by contextual AI-generated content.

## Key Features

### Editorial Interface
- **Digital Masthead**: Interactive newspaper-style header with integrated clock functionality
- **Chronos Terminal**: Specialized utility window featuring timer, alarm, and world clock capabilities with city search
- **Dynamic News Feed**: Real-time, AI-generated content powered by Google Gemini with satirical and insightful perspectives
- **Animated Ticker**: Customizable ticker for capturing quick thoughts and real-time updates

### Writing Tools
- **Neobrutalist Editor**: Rich text editor powered by Tiptap with custom formatting and print-optimized layouts
- **Reflective Writing Space**: Dedicated area for focused journaling with persistent data storage
- **Reading Mode**: Clean, publication-ready preview for reviewing and refining entries

### Design & Accessibility
- **Theme System**: Comprehensive dark/light mode implementation using CSS variables
- **Premium Interface Elements**: Macintosh-inspired window controls with glassmorphism effects
- **Responsive Design**: Fully optimized for desktop and tablet experiences

## Technology Stack

| Component | Technology |
|-----------|------------|
| **Framework** | [Next.js 16](https://nextjs.org/) with Turbopack |
| **Language** | TypeScript (95% of codebase) |
| **Styling** | Tailwind CSS |
| **Animations** | Framer Motion |
| **Authentication** | [Clerk](https://clerk.com/) |
| **AI Integration** | [Google Gemini Pro API](https://ai.google.dev/) |
| **Database** | MongoDB with Mongoose ODM |
| **UI Components** | Lucide React Icons |

## Getting Started

### Prerequisites
- Node.js 18 or higher
- MongoDB instance (Atlas or self-hosted)
- Clerk account for authentication
- Google AI Studio API key

### Environment Configuration

Create a `.env.local` file in the project root with the following variables:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_pub_key
CLERK_SECRET_KEY=your_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Database Configuration
MONGODB_URI=your_mongodb_uri

# AI Features
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_key
```

### Installation & Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Rosenmunda/RaagJournal.git
   cd RaagJournal
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:3000`.

## Contributing

We welcome contributions from the community. The development process follows standard Git workflows:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit changes: `git commit -m 'Add: brief description of changes'`
4. Push to branch: `git push origin feature/your-feature-name`
5. Submit a Pull Request with detailed description

Please ensure code adheres to the project's TypeScript standards and includes appropriate test coverage.

## License

This project is licensed under the MIT License. See the `LICENSE` file for full terms and conditions.

## Author

Created by **[Anurag Sen](https://github.com/Rosenmunda)**

Special acknowledgment to the open-source community and contributors to the Neobrutalist design movement.

---

*"Yesterday is but today's memory, and tomorrow is today's dream."*
