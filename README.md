# Job Tracker SaaS

A full-stack Job Application Tracking System built with modern web technologies. Monitor, manage, and track your job applications efficiently with a beautiful, recruiter-friendly interface.

## 🚀 Live Demo

[Add your live demo link here]

## 📋 Table of Contents

- [About the Project](#about-the-project)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Getting Started](#getting-started)
- [CI/CD Pipeline](#cicd-pipeline)
- [Screenshots](#screenshots)
- [License](#license)

## 📝 About the Project

**Job Tracker SaaS** is a complete job application management platform that helps job seekers organize their applications, track progress, and stay on top of opportunities. The platform features:

- **User Authentication** - Secure sign-up and login with JWT
- **Application Dashboard** - Visual overview of all job applications
- **CRUD Operations** - Create, read, update, and delete job listings
- **Responsive Design** - Works seamlessly on mobile, tablet, and desktop
- **Modern UI** - Professional, eye-catching design that stands out to recruiters

## 🛠 Tech Stack

### Frontend
- **Next.js 16** with React 19
- **Tailwind CSS v4** - Utility-first styling
- **TypeScript** - Type-safe development

### Backend
- **Node.js + Express** - RESTful API
- **Prisma ORM** - Database toolkit
- **PostgreSQL** - Relational database
- **bcrypt** & **jsonwebtoken** - Authentication

### Mobile (Expo)
- **React Native** with Expo
- Cross-platform support (iOS, Android, Web)

## ✨ Features

| Feature | Description |
|---------|-------------|
| **Authentication** | Secure signup/login with password hashing and JWT tokens |
| **Application Tracking** | Add, edit, and delete job applications |
| **Status Tracking** | Track application status (Applied, Interview, Offer, Rejected) |
| **Dashboard** | Visual summary of application progress |
| **Responsive** | Mobile-first design working on all devices |
| **Dark/Light Theme** | Automatic theme support |

## 🚀 Getting Started

### Prerequisites

- Node.js (v20+)
- npm or yarn
- PostgreSQL database

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/BenDiya07/job-tracker-saas.git
   cd job-tracker-saas
   ```

2. **Install frontend dependencies**
   ```bash
   cd job-tracker-web
   npm install
   ```

3. **Install API dependencies**
   ```bash
   cd ../job-tracker-api
   npm install
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your PostgreSQL connection string
   ```

5. **Run the development servers**
   ```bash
   # In one terminal
   cd job-tracker-api && npm run dev
   
   # In another terminal
   cd job-tracker-web && npm run dev
   ```

## 🔄 CI/CD Pipeline

This project includes GitHub Actions for automated testing, building, and deployment.

### Workflows

#### 1. **Lint & Test** (`/.github/workflows/lint-test.yml`)
   - Runs ESLint on code
   - Executes test suite
   - Fails on any linting errors

#### 2. **Build & Deploy** (`/.github/workflows/deploy.yml`)
   - Installs dependencies
   - Builds Next.js application
   - Deploys to production on merge to `main`

### `.github/workflows/` Structure

```yaml
# Example workflow structure
name: CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lint-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm install
      - run: npm run lint
      - run: npm test

  build:
    needs: lint-test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm install
      - run: npm run build
```

## 📸 Screenshots

![Job Tracker Dashboard](screenshots/dashboard.png)
![Job Application Form](screenshots/form.png)
![Mobile View](screenshots/mobile.png)

> *Add screenshots of your application to showcase the UI/UX*

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ by BenDiya07**

*Ready to impress recruiters with a professional, full-stack SaaS application!*