# 🗞️ RaagJournal: Chronicles of the Everyday Mind

RaagJournal is a premium, open-source personal journaling application designed with a **70% Vintage Newspaper / 30% Modern Pop-Art** aesthetic. It blends the nostalgia of classic broadsheets with high-contrast Neobrutalist design and AI-powered intelligence.

![RaagJournal Hero](public/logo.png)

## ✨ Features

### 🗞️ The Broadsheet Experience
- **Interactive Masthead**: A classic newspaper header featuring a digital clock that triggers the **Chronos.app** terminal.
- **Chronos Terminal**: A Mac-inspired window dialog with a functional **Timer**, **Alarm**, and **World Clock** (searchable by city).
- **Global Broadside**: A real-time AI-generated news feed powered by **Google Gemini**, providing a satirical yet insightful backdrop to your day.
- **Breaking News Ticker**: A customizable, animated ticker for quick thoughts and current vibes.

### 🖋️ Distraction-Free Journaling
- **Neobrutalist Editor**: A sleek, Tiptap-powered rich text editor with custom section dividers and print-ready formatting.
- **Thought of the Day**: Dedicated space for deep reflection, persisted directly to your personal database.
- **Reading Mode**: Seamlessly switch between editing and a clean, printed-page preview.

### 🌓 Modern Performance
- **Dark/Light Mode**: Fully responsive theme engine using CSS variables (`bg-paper` and `ink`).
- **Mac-Style Dialogs**: Premium window controls (Red/Yellow/Green) and glassmorphism effects for secondary tools.
- **Shiny stickers**: Floating LinkedIn buttons and custom branded assets for a high-end feel.

## 🚀 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Authentication**: [Clerk](https://clerk.com/)
- **AI Engine**: [Google Gemini Pro](https://ai.google.dev/)
- **Database**: MongoDB via Mongoose
- **Icons**: Lucide React

## 🛠️ Setup & Installation

### Prerequisites
- Node.js 18+
- A MongoDB instance (Atlas or local)
- A Clerk Account (for Auth)
- A Google AI Studio API Key (for Gemini)

### Environment Variables
Create a `.env.local` file in the root directory and add the following:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_pub_key
CLERK_SECRET_KEY=your_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Database
MONGODB_URI=your_mongodb_uri

# AI Features
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_key
```

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Rosenmunda/RaagJournal.git
   cd RaagJournal
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 💖 Credits

Created with ❤️ by **[Anurag Sen](https://github.com/Rosenmunda)**.
Special thanks to the open-source community and the creators of the Neobrutalist movement.

---
*"Yesterday is but today's memory, and tomorrow is today's dream."*
