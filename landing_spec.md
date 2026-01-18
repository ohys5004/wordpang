# WordPang Landing Page Specification

## 1. Overview
WordPang's landing page is designed to introduce the "Corporate Synergy Simulator" concept with a premium, high-tech aesthetic similar to YC startup launches. It aims to convert visitors into users by showcasing the core value proposition: **"Merge Companies. Ignite Synergies."**

- **Target Audience**: Tech enthusiasts, startup founders, investors, and curious minds.
- **Goal**: Drive traffic to the main application (`/` path).
- **URL**: `/en/landing` (and localized versions)

## 2. Design Aesthetics
- **Theme**: Dark Mode High-Tech (Glassmorphism)
- **Primary Colors**: Black (`#050505`) background with gradients of Purple (`#A855F7`) and Blue (`#3B82F6`).
- **Typography**: `Outfit` (Google Fonts) for a modern, geometric look.
- **Vibe**: Futuristic, clean, energetic, and professional.

## 3. Key Sections
### 3.1. Navigation Bar
- **Logo**: "W" monogram in a gradient box + "WordPang" text.
- **CTA**: "Launch App" button (top-right) for immediate access.

### 3.2. Hero Section
- **Badge**: "Powered by OpenAI & Supabase" to emphasize tech stack.
- **Headline**: "Merge Companies. Ignite Synergies." (Gradient text effect).
- **Sub-headline**: Provocative question ("What happens if Tesla acquires NVIDIA?") + solution description.
- **Primary CTA**: "Start Merging Now" (White button, high contrast).
- **Secondary CTA**: "View on GitHub" (Glass button).

### 3.3. Visual Demo (Interaction Showcase)
- **Concept**: A visual representation of two diverse companies (e.g., Apple + Tesla) merging into one.
- **Animation**: Floating particles and a central "Merge" icon connecting the two logos.
- **Result Card**: Displays the AI-generated synergy outcome (e.g., "iCar Autonomous Ecosystem").

### 3.4. Features Grid
- **S&P 500 Data**: Highlight real-time database connection.
- **AI Strategy**: Emphasize the depth of generated business roadmaps.
- **Investment Insights**: Mention market analysis capabilities.

### 3.5. Footer
- Simple copyright and stack attribution.

## 4. Technical Implementation
- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS + Framer Motion (for animations).
- **Responsiveness**: Fully responsive layout (Mobile stacked, Desktop grid).
- **Performance**:
    - `next/font` for optimized font loading.
    - Client-side animations (`framer-motion`) only where necessary.
    - Static generation compatible.

## 5. Deployment
- **Integration**: Part of the main `wordpang` repository.
- **Route**: Accessible via `/[locale]/landing`.
- **Platform**: Vercel (Auto-deployed via Git push).
