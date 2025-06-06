# Shelfie

Welcome to Shelfie!

Shelfie is your personal digital bookshelf - a modern web application that helps you organize, track, and discover books. Whether you're an avid reader or just getting started, Shelfie makes it easy to manage your reading journey, create reading lists, and share your literary adventures with others.

Let's get you set up and running. 🚀

## Prerequisites

Before you begin, make sure you have:

- **Node.js v20+** installed on your system
  - Not sure if you have it? Run `node --version` to check
  - Need to install? Visit [Node.js official website](https://nodejs.org/) or use [nvm](https://github.com/nvm-sh/nvm) for easy version management
- **pnpm** package manager
  - Don't have it? Follow the [pnpm installation guide](https://pnpm.io/installation)

## Setup Instructions

1. **Clone the repository** (if you haven't already)

   ```bash
   git clone https://github.com/sachiv/shelfie
   cd shelfie
   ```

2. **Environment Setup**

   ```bash
   cp .env.example .env
   ```

   Now, open `.env` in your favorite editor and fill in the required variables.

3. **Install Dependencies**

   ```bash
   pnpm install
   ```

4. **Database Setup**

   ```bash
   # Run database migrations
   pnpm run migrate

   # Optional: Seed the database with sample data
   pnpm migration:seed
   ```

5. **Start Development Server**
   ```bash
   pnpm run dev
   ```

Visit [http://localhost:3000](http://localhost:3000) in your browser to see your app running! 🎉

## Deploy 🚀

Ready to deploy your own Shelfie app? We've got you covered with two easy options:

### Quick Deploy (Recommended for Beginners)

This option includes all the default integrations and is perfect for getting started quickly.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fsachiv%2Fshelfie&env=NEXT_PUBLIC_STACK_PROJECT_ID,NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY,STACK_SECRET_SERVER_KEY,MONGO_URL&integration-ids=oac_VqOgBHqhEoFTPzGkPd7L0iH6&skippable-integrations=1)

### Advanced Deploy

For more control over your deployment, use this option which allows you to configure all integrations manually.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fsachiv%2Fshelfie&env=NEXT_PUBLIC_STACK_PROJECT_ID,NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY,STACK_SECRET_SERVER_KEY,MONGO_URL,POSTGRES_URL,NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY)

> 💡 **Pro Tip**: Make sure to set up all the required environment variables in your Vercel project settings before deployment.
