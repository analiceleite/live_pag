# TagTrack 🏷️

> A modern e-commerce management platform for clothing businesses

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Angular](https://img.shields.io/badge/Angular-17.x-red?logo=angular)](https://angular.io/)
[![Node.js](https://img.shields.io/badge/Node.js-18.x%20%7C%2020.x-brightgreen)](https://nodejs.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker)](https://www.docker.com/)

## 📋 Table of Contents

- [Introduction](#-introduction)
- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Configuration](#-configuration)
- [Development](#-development)
- [Deployment](#-deployment)
- [Project Status](#-project-status)
- [Contributing](#-contributing)
- [License](#-license)

## 🌟 Introduction

TagTrack is a comprehensive e-commerce management solution designed specifically for clothing retailers. It streamlines inventory management, order processing, customer communications, and business analytics in one powerful platform.

Created by Analice Leite, this project aims to revolutionize how clothing businesses handle their online operations with modern, efficient technology.

## ✨ Features

### 🛍️ Sales & Inventory Management
- End-to-end order lifecycle tracking
- Real-time inventory synchronization
- Streamlined checkout process
- Order status monitoring

### 📱 Customer Engagement
- WhatsApp integration for order notifications
- Digital receipt generation and delivery
- Customer profile management
- Order tracking for customers

### 💼 Business Intelligence
- Comprehensive financial reporting
- Sales trend visualization and forecasting
- Excel export for data analysis
- Performance dashboards

### 🔐 Security & Administration
- Role-based access control
- Secure authentication with JWT
- Data encryption
- Audit logging

## 🚀 Technology Stack

### Frontend
- **Framework**: Angular 15+
- **Language**: TypeScript 4.9+
- **State Management**: RxJS
- **UI Components**: Angular Material
- **Styling**: Tailwind CSS

### Backend
- **Runtime**: Node.js (18.x, 20.x)
- **Framework**: Express.js
- **Language**: TypeScript
- **API**: RESTful architecture

### Database
- **Primary Database**: PostgreSQL running locally with Docker
- **Cloud Database**: Supabase

### DevOps & Tools
- **Containerization**: Docker, Docker Compose
- **Code Quality**: Prettier

## 🏗️ Architecture

TagTrack uses a monorepo structure with frontend, backend, and database configurations in the same repository.

```
tag_track/
├── frontend/           # Angular application
│   ├── src/
│   │   ├── app/
│   │   │   ├── @services/      # Singleton services & API clients
│   │   │   ├── @common/        # Reusable UI components & pipes
│   │   │   └── @domain/        # Feature modules by business domain
│   │   ├── assets/
│   │   └── environments/
│   └── package.json    # Frontend dependencies and scripts
│
├── backend/            # Node.js/Express application
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── middleware/
│   ├── server.js       # Main application entry
│   └── package.json    # Backend dependencies and scripts
│
├── database/           # Database configurations
│   ├── Dockerfile
│   ├── init.sql
│   └── seed.sql
│
└── package.json        # Root package.json for monorepo commands
```

## 🚦 Getting Started

### Prerequisites
- Node.js (v18.x or v20.x)
- npm (v8.x or v10.x)
- Docker & Docker Compose (optional, for containerized setup)
- PostgreSQL (if running locally)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/analiceleite/tag_track.git
cd tag_track
```

2. **Install dependencies**
```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
cd ..
```

3. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Start development servers**
```bash
# Using Docker (recommended)
docker-compose up

# Or start frontend and backend separately
```

## ⚙️ Configuration

### Backend Environment Variables

```env
# Application Environment
NODE_ENV=local                 # Application environment (local or prod)

# Production Database Configuration
DATABASE_URL=<database_url>    # PostgreSQL connection string (production)

# Development Database Configuration
PGHOST=localhost               # PostgreSQL host
PGUSER=root                    # PostgreSQL username
PGPASSWORD=root                # PostgreSQL password
PGDATABASE=brecho              # PostgreSQL database name
PGPORT=5433                    # PostgreSQL port

# Application Configuration
PORT=3000                      # Application server port
```

### Frontend Environment Configuration

The Angular application uses environment-specific configuration files:

```typescript
// Development (environment.ts)
export const environment = {
    production: false,
    apiUrl: 'http://localhost:3000/api',
    version: '1.0.0',
    featureFlags: {
        enableAnalytics: true,
        enableWhatsAppIntegration: true
    }
};

// Production (environment.prod.ts)
export const environment = {
    production: true,
    apiUrl: 'https://tag-track.onrender.com/api',
    version: '1.0.0',
    featureFlags: {
        enableAnalytics: true,
        enableWhatsAppIntegration: true
    }
};
```

## 💻 Development

### Available Commands

#### Frontend Commands (run from `/frontend` directory)
```bash
# Development server
npm run dev           # Start Angular dev server at http://localhost:4200

# Build
npm run build         # Production build
npm run prod          # Alternative production build command

# Other commands
npm run watch         # Development build with watch mode
npm run serve-prod    # Build and serve production version locally
npm run deploy        # Production build with custom base href for deployment
```

#### Backend Commands (run from `/backend` directory)
```bash
# Development server
npm run dev           # Start backend with nodemon for auto-reload

# Production
npm start             # Start backend server
```

### Using Docker for Development

For a complete development environment using Docker:

```bash
# Start all services (frontend, backend, database)
docker-compose up

# Rebuild containers after dependency changes
docker-compose up --build

# Start only specific services
docker-compose up frontend
docker-compose up backend
docker-compose up database
```

## 🚢 Deployment

TagTrack is configured for deployment on cloud platforms:

### Frontend Deployment
- **Platform**: Netlify
- **Command**: `cd frontend && npm run deploy`
- **Build output**: `frontend/dist/frontend`
- **Base URL**: `/tag_track/`

### Backend Deployment
- **Platform**: Render
- **Command**: `cd backend && npm start`
- **Environment**: Node.js 18.x or 20.x

### Database
- **Provider**: Supabase PostgreSQL
- **Connection**: Secured via environment variables in the backend

### Deployment Flow
1. Push changes to the main branch
2. Frontend automatically builds and deploys to Netlify
3. Backend deploys to Render
4. Database migrations run automatically on deployment

## 📈 Project Status

Current Version: 1.0.0-beta

| Feature | Status |
|---------|--------|
| Core Platform | ✅ Complete |
| Sales Management | ✅ Complete |
| WhatsApp Integration | ✅ Complete |
| Payment Processing | ✅ Complete |
| Analytics Dashboard | 🔄 In Progress |
| Mobile App | 📋 Planned |
| Multi-store Support | 📋 Planned |
| AI-powered Recommendations | 🔍 Under Research |

## 🤝 Contributing

We welcome contributions from the community! To get started:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to your branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

For more details, please read our [Contributing Guide](CONTRIBUTING.md).

## 📝 License

[MIT](LICENSE) © Analice Leite

---

<div align="center">
  <p>
    <a href="https://github.com/analiceleite">
      <img src="https://img.shields.io/github/followers/analiceleite?label=Follow&style=social" alt="GitHub Follow" />
    </a>
    <a href="https://github.com/analiceleite/tag_track/stargazers">
      <img src="https://img.shields.io/github/stars/analiceleite/tag_track?style=social" alt="GitHub Stars" />
    </a>
  </p>
  <p>Built with ❤️ by Analice Leite</p>
</div>