# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js application that generates weekly reports using AI. Users input brief work descriptions and receive formatted weekly reports in markdown format. The application supports both Chinese and English localization and can use either server-side API keys or user-provided API keys.

## Commands

### Development
- `npm run dev` - Start development server on localhost:3000
- `npm run build` - Build the application for production
- `npm start` - Start production server

### Installation
- `npm install` - Install dependencies

## Architecture

### Core Components
- **Main UI**: `pages/index.tsx` - Main application interface with form inputs, loading states, and result display
- **API Handler**: `pages/api/generate.ts` - Edge function that processes requests and communicates with AI API
- **AI Streaming**: `utils/OpenAIStream.ts` - Handles streaming responses from DeepSeek API (not OpenAI despite the name)

### Key Features
- **Internationalization**: Uses next-intl with messages in `messages/` (en.json, zh.json)
- **AI Integration**: Currently uses DeepSeek API instead of OpenAI (`api.deepseek.com/v1/chat/completions`)
- **Streaming Responses**: Real-time streaming of AI-generated content
- **Dual API Key Support**: Can use server-side keys or user-provided keys based on `NEXT_PUBLIC_USE_USER_KEY` env var

### Components Structure
- `components/DropDown.tsx` - Form type selector (currently minimal)
- `components/Header.tsx` - Page header
- `components/Footer.tsx` - Page footer
- `components/LoadingDots.tsx` - Loading animation
- `components/ResizablePanel.tsx` - Responsive content panel

### Environment Variables
- `OPENAI_API_KEY` - API key(s) for DeepSeek (can be comma-separated for rotation)
- `NEXT_PUBLIC_USE_USER_KEY` - Set to "true" to require users to provide their own API keys

## Development Notes

### AI Model Configuration
- Currently configured to use "deepseek-chat" model in `pages/api/generate.ts:30`
- The prompt is hardcoded in Chinese: "请帮我把以下的工作内容填充为一篇完整的周报，请直接用markdown格式以分点叙述的形式输出:"
- Temperature: 0.7, max_tokens: 1000

### Styling
- Uses Tailwind CSS for styling
- Custom CSS in `styles/globals.css` and `styles/markdown.css`
- Responsive design with mobile-first approach

### Deployment
- Configured for Vercel deployment with Edge Runtime
- Supports Docker deployment
- Next.js standalone output mode enabled in `next.config.js`

### Error Handling
- Toast notifications using react-hot-toast
- Validation for empty inputs and API key requirements
- Fallback error messages for API failures