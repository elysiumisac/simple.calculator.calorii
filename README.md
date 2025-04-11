# AI Food Calorie Tracker

A web application that analyzes food photos using ChatGPT's vision API to estimate calories and nutritional information. Built with Next.js, OpenAI, and Supabase.

## Features

- Upload food photos and get AI-powered calorie estimates
- Save food entries to your personal history
- Track your calorie intake over time
- Modern, responsive UI built with TailwindCSS

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- OpenAI API key
- Supabase account

### Installation

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Copy `.env.local.example` to `.env.local` and fill in your API keys:
   ```
   cp .env.local.example .env.local
   ```
4. Run the development server:
   ```
   npm run dev
   ```

## Setting Up Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Create a new table called `food_entries` with the following schema:

```sql
create table food_entries (
  id uuid default uuid_generate_v4() primary key,
  food_name text not null,
  calories integer not null,
  description text,
  image_url text,
  timestamp timestamptz default now() not null
);

-- Optional: Enable Row Level Security and create policies if needed
alter table food_entries enable row level security;
```

3. Get your Supabase URL and anon key from the API settings page
4. Add these to your `.env.local` file

## Deploying to Netlify

1. Push your code to a GitHub repository
2. Log in to [Netlify](https://netlify.com)
3. Click "New site from Git"
4. Select your repository
5. Configure the build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
6. Add your environment variables in the Netlify dashboard:
   - `OPENAI_API_KEY`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
7. Deploy your site!

## Usage

1. Open the application in your browser
2. Click on the "Upload Photo" button to select a food image
3. Click "Analyze Food" to get the AI-powered calorie estimate
4. Review the results and click "Save to History" to save the entry
5. View your food history in the right panel

## License

MIT
