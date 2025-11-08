# 100x Voice Agent - Bonagiri Sanjana

An AI-powered voice interview assistant showcasing natural language processing, text-to-speech synthesis, and conversational AI capabilities.

## Features

- **Voice Interaction**: Speak naturally with the AI assistant
- **Text-to-Speech**: Responses are spoken aloud with audio controls
- **Interview Simulation**: Ask questions about Bonagiri Sanjana's background, skills, and experience
- **Multiple Input Methods**: Use voice, text input, or click example questions
- **Responsive Design**: Works on all device sizes

## Technologies Used

- React + TypeScript
- Vite
- shadcn-ui + Tailwind CSS
- Supabase (Edge Functions for TTS)
- React Hook Form + Zod

## Project Structure

```
├── public/                 # Static assets
├── src/
│   ├── components/         # React components
│   ├── hooks/              # Custom React hooks
│   ├── integrations/       # Supabase integration
│   ├── lib/                # Utility functions
│   ├── pages/              # Page components
│   └── App.tsx             # Main application component
├── supabase/
│   └── functions/          # Supabase Edge Functions
└── vite.config.ts          # Vite configuration
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Environment Variables

Create a `.env` file in the root directory with your API credentials:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
LOVABLE_API_KEY=your_lovable_api_key  # If using Lovable AI gateway
```

## Author

Bonagiri Sanjana - Python Developer & Full Stack Engineer

© 2025 Bonagiri Sanjana. All rights reserved.