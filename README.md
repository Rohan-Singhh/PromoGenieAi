# PromoGenieAI 🎯

PromoGenieAI is a powerful AI-driven platform that helps businesses create engaging video ad scripts with ease. Leveraging Groq's advanced AI capabilities, our platform generates customized video advertising scripts tailored to your product and audience.

## 🌟 Features

- **AI-Powered Script Generation**: Create compelling video ad scripts using Groq AI
- **Customizable Parameters**: Tailor scripts by product, audience, tone, and style
- **Script History**: Track and manage your generated scripts
- **User Dashboard**: Intuitive interface for script management
- **Modern UI/UX**: Responsive design with dark/light mode support
- **Secure Authentication**: JWT-based user authentication system

## 🚀 Live Demo

- Frontend: [https://promo-genie-ai-tgyr.vercel.app ](https://promo-genie-ai-tgyr.vercel.app )
- Backend: [https://promogenieai.onrender.com](https://promogenieai.onrender.com)

## 🛠️ Tech Stack

### Frontend
- React + Vite
- Tailwind CSS
- React Router for navigation
- Axios for API integration
- Context API for state management

### Backend
- Node.js
- Express.js
- MongoDB
- Groq AI API (llama3-70b-8192 model)
- JWT Authentication
- Security middleware (CORS, Helmet, Rate Limiting)

## 🏗️ Project Structure

```
PromoGenieAI/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── Features.jsx
│   │   │   ├── HowItWorks.jsx
│   │   │   ├── Testimonials.jsx
│   │   │   ├── Pricing.jsx
│   │   │   ├── FAQ.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── SignIn.jsx
│   │   │   ├── Demo.jsx
│   │   │   ├── Layout.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── PrivateRoute.jsx
│   │   │   ├── GenerationModal.jsx
│   │   │   ├── ScriptDisplayModal.jsx
│   │   │   └── SettingsModal.jsx
│   │   ├── services/
│   │   │   └── authService.js
│   │   ├── context/
│   │   │   └── ThemeContext.jsx
│   │   ├── assets/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── .env.development
│   ├── .env.production
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
└── backend/
    ├── config/
    │   ├── db.js
    │   ├── groq.js
    │   └── dotenv.js
    ├── controllers/
    │   ├── authController.js
    │   └── groqController.js
    ├── middlewares/
    │   ├── auth.js
    │   └── errorHandler.js
    ├── models/
    │   ├── User.js
    │   └── Script.js
    ├── routes/
    │   ├── authRoutes.js
    │   └── groqRoutes.js
    ├── utils/
    │   ├── inputValidator.js
    │   └── tokenUtils.js
    ├── server.js
    └── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB
- Groq API key

### Frontend Setup
1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.development` file:
```env
VITE_API_BASE_URL=http://localhost:5000
```

4. Create `.env.production` file:
```env
  VITE_API_BASE_URL=https://promogenieai.onrender.com
```

5. Start development server:
```bash
npm run dev
```

### Backend Setup
1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
MONGODB_URI=your_mongodb_uri
PORT=5000
NODE_ENV=development
GROQ_API_KEY=your_groq_api_key
JWT_SECRET=your_jwt_secret
```

4. Start server:
```bash
npm start
```

## 🔒 Authentication

The platform uses JWT-based authentication:
- Register with full name, email, and password
- Login to receive JWT token
- Protected routes require valid token
- Automatic token handling in frontend

## 📱 Features Overview

### 1. User Authentication
- Secure login/signup system
- JWT token-based authentication
- Password encryption
- Theme preference persistence

### 2. Dashboard
- Modern, responsive design
- Dark/light mode toggle
- Script generation history
- User settings management

### 3. Script Generation
- AI-powered content creation using Groq's llama3-70b-8192 model
- Customizable parameters:
  - Product name
  - Target audience
  - Tone
  - Ad style
  - Call to action
- Structured script sections:
  - Opening Hook (10-15 seconds)
  - Problem/Solution (20-30 seconds)
  - Key Benefits (20-25 seconds)
  - Call to Action (10-15 seconds)
- Real-time preview
- Generates 4 unique scripts per request

## 🔐 Security Features

- JWT Authentication
- Password Encryption
- CORS Protection
- Rate Limiting
- Helmet Security Headers

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Team

- Rohan Ranjan - Full Stack Developer, Competitive Programmer