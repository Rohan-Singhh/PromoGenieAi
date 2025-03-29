# PromoGenieAI 🎯

PromoGenieAI is a powerful AI-driven platform that helps businesses create engaging promotional content and marketing materials with ease. Our platform combines modern design with advanced AI capabilities to streamline your marketing workflow.

## 🌟 Features

- **AI-Powered Ad Generation**: Create compelling ad copy with advanced AI
- **Video Studio**: Generate and edit promotional videos
- **Analytics Dashboard**: Track your campaign performance
- **Subscription Management**: Flexible plans for different needs
- **Modern UI/UX**: Intuitive interface with dark/light mode support

## 🚀 Live Demo

- Frontend: On Vercel
- Backend: [https://promogenieai.onrender.com](https://promogenieai.onrender.com)

## 🛠️ Tech Stack

### Frontend
- React + Vite
- Tailwind CSS
- Framer Motion
- Axios for API calls
- React Router for navigation

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- CORS enabled

## 🏗️ Project Structure

```
PromoGenieAI/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   └── SignIn.jsx
│   │   ├── services/
│   │   │   └── authService.js
│   │   └── App.jsx
│   ├── .env
│   └── package.json
│
└── backend/
    ├── models/
    │   └── User.js
    ├── middleware/
    │   └── error.js
    ├── index.js
    └── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB

### Frontend Setup
1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
VITE_API_BASE_URL=https://promogenieai.onrender.com
```

4. Start development server:
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
```

4. Start server:
```bash
npm start
```

## 🔒 Authentication

The platform uses JWT-based authentication:
- Register with email and password
- Login to receive JWT token
- Protected routes require valid token
- Automatic token handling in frontend

## 📱 Features Overview

### 1. User Authentication
- Secure login/signup system
- JWT token-based authentication
- Password encryption
- Session management

### 2. Dashboard
- Modern, responsive design
- Dark/light mode toggle
- Real-time statistics
- User profile management

### 3. Ad Generation
- AI-powered content creation
- Multiple ad format support
- Template library
- Real-time preview

### 4. Video Studio
- Video content generation
- Custom editing tools
- Export in multiple formats
- Template-based creation

### 5. Analytics
- Campaign performance tracking
- User engagement metrics
- ROI calculations
- Custom report generation

## 🔐 Security Features

- JWT Authentication
- Password Encryption
- CORS Protection
- Rate Limiting
- Secure Headers (Helmet)
- Input Validation

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Team

- Rohan Ranjan - Full Stack Developer