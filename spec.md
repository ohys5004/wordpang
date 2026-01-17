# Project Spec: WordPang

## 1. Project Overview
**WordPang** is an interactive platform inspired by "Infinite Craft," where users explore, combine, and generate professional business ideas. It bridges the gap between a playful creative tool and a strategic brainstorming engine for business leaders, using real-world data and LLMs to simulate company mergers and new ventures.

## 2. Key Features

### 2.1. Global Header & Multilingual Support
- **Language Toggle**: Top header switch between **Korean (KO)** and **English (EN)**.
- **Authentication**: Simple social login (Google/NextAuth) to save progress.
- **Idea Board**: A dedicated section to view, save, and share "My Idea Board" containing generated synergies.

### 2.2. Smart Sidebar (Company Explorer)
- **Preset & Custom List**: A searchable list of companies.
- **Sorting Logic**: Companies are ordered by **"Recently Used"** to keep relevant keywords accessible.
- **URL-to-Company**: Input a URL to scrape/scrape-estimate company data.
- **Data Fallback**: If official data is missing, AI generates an **"Estimated based on web info"** disclaimer for fields like employee count or founding year.

### 2.3. Recursive Interactive Canvas
- **Unlimited Combinations**: 
  - Dragging Keyword A onto Keyword B creates a **Hybrid Keyword**.
  - Hybrid Keywords can be combined with other existing companies or other Hybrid Keywords indefinitely.
- **Deterministic Outcomes**: The primary result of a combination is standardized for discovery, but the internal "Intelligence" is generated on-demand.

### 2.4. Company Intelligence (Detail View)
- Clicking a keyword shows a professional info panel:
  - Name, Logo, URL, Products, Employee Count (Estimated tag if applicable), Founding Year, and Brief Description.

### 2.5. Synergy Generation (AI-Powered)
- **5-Point Strategic Proposal**: Clicking a combined keyword triggers the AI to generate a detailed report with 5 distinct angles:
  1. **Stable Revenue Model**: Proven business models and monetization strategies.
  2. **Disruptive Innovation**: Radical shifts that challenge the status quo.
  3. **Niche Market Strategy**: Targeting specific, underserved segments.
  4. **B2B Workflow Integration**: Efficiency and enterprise-level synergy.
  5. **Future-Oriented Concept**: Long-term visionary ideas.
- **Naming Recommendations**: AI suggests 3-5 creative names for the new entity.

## 3. UI/UX Design Goals
- **Professional Playfulness**: Serious dark-mode aesthetics (glassmorphism) mixed with satisfying physical interactions.
- **Discovery UX**: Visual feedback when a combination is successful.
- **Persistence**: "Recently used" keywords float or are highlighted in the sidebar.

## 4. Technical Stack
- **Frontend**: Next.js (App Router), Framer Motion for physics and drag-and-drop.
- **Backend/Auth**: NextAuth.js for social login, Supabase or Firebase for persisting the "Idea Board."
- **AI/LLM**: GPT-4o or Gemini 1.5 Pro for data estimation and strategic proposal generation.
- **Internationalization**: `next-intl`.

## 5. User Workflow
1. **Login & Settings**: Sign in and choose language.
2. **Scout**: Browse known companies or add a new startup via URL.
3. **Pang (Combine)**: Merge keywords on the canvas to see what kind of "Hybrid" emerges.
4. **Strategize**: Click the new keyword to read the 5-point AI proposal.
5. **Collect**: Save the best ideas to "My Idea Board" and share them with colleagues.
