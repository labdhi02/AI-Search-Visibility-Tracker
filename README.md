# 🤖 AI Search Visibility Tracker

## 📝 Project Overview
=======
This project implements an AI Search Visibility Tracker using Node.js and TypeScript. It monitors how brands appear in AI-powered search results (Perplexity, Google AI Overviews, ChatGPT, etc.) and tracks competitor performance across multiple engines.

### ✨ Key Features
- 🔍 **Multi-Engine Data Collection:** Automated querying of  Google SERP APIs, Gemini API, and Grok API.
- 🧠 **Intelligent Brand Detection:** Parses AI responses to detect brand mentions, positioning, sentiment, and perform competitor analysis.
- ⏰ **Automated Scheduling:** Runs 25 queries per day across 3 time windows (9AM, 1PM, 7PM IST) with anti-detection measures.
- 📊 **Data Pipeline:** Stores results in Google Sheets, with raw data and that sheet is visible to only admin.

## 🏗️ Architecture Stack
- 🟩 **Node.js 20+ / TypeScript**
- ⚡ **Next.js** (App directory)
- 🎨 **Shadcn UI and** (for modern UI components)
- 🗄️ **PostgreSQL** (for structured data storage, managed via migration scripts)
- 📑 **Google Sheets** (primary data store, no traditional DB required)
- 🌐 **Google SERP, Gemini, Grok APIs**
- 🟦 **Redis (Upstash Cloud)** (cloud-based caching in the Next.js app, integrated using ioredis)
- ⏲️ **Node-cron** (for automated scheduling and resetting queries)
- 📝 **React-markdown** (for rendering markdown content)

## ⚙️ How It Works
1. ⏰ **Automated Scheduling:** Queries are scheduled and distributed throughout the day (9AM, 1PM, 7PM IST) using node-cron to avoid detection.
2. 🤖 **Multi-Engine Querying:** The system automatically queries multiple AI search engines and APIs (Google SERP, Gemini, Grok, etc.).
3. 🧠 **Brand & Competitor Analysis:** Responses are parsed to extract brand mentions, positioning, sentiment, and competitor insights.
4. 📊 **Data Storage:** All results are stored in Google Sheets for easy access and visibility (admin-only access).


## 🛠️ Features
- 🤖 AI-powered search and brand analysis
- 🔐 User authentication (login/signup)
- 🔗 Integration with Google Sheets, Gemini, Grok, and SERP APIs
- 📈 Brand analysis result display
- 🚀 Redis caching
- 🧩 Modular component structure

## 🧰 Tech Stack
- ⚡ Next.js (React, TypeScript)
- 🎨 Tailwind CSS
- 🟦 Redis
- 📑 Google Sheets API
- 🌐 Gemini, Grok, SERP APIs

## 🚀 Getting Started

### 📋 Prerequisites
- 🟩 Node.js (v16+ recommended)
- 📦 npm or yarn

### 🏁 Installation
1. 📥 Clone the repository:
   ```bash
   git clone <repo-url>
   cd my-app
   ```
2. 📦 Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
3. ⚙️ Set up environment variables:
   - Copy `.env.example` to `.env` and fill in the required values.

4. 🗄️ Run database migrations (if applicable):
   ```bash
   # Example using a migration tool
   npm run migrate
   ```

5. 🏃‍♂️ Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. 🌐 Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure
- `app/` - Next.js app directory (pages, API routes, layouts)
- `components/` - Reusable UI components
- `modules/` - Feature modules (brand analysis, login, signup, queries)
- `lib/` - Utility libraries (Redis, helpers)
- `migrations/` - Database migration scripts
- `public/` - Static assets

## 📜 Scripts
- `dev` - Start development server
- `build` - Build for production
- `start` - Start production server

## 🪪 License
MIT

---

For more details, see the code and comments in each module.



credential file is for google sheet managemnt
then migration is to write sql in it
.gmrc for graphile migration
in lin utils.ts is for tailwind css class conflict regarding issue
and in lib redis.ts is for redis configuration
>>>>>>> a9fcf3e (UI changes)
