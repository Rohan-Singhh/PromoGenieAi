import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';
import Hero from './components/Hero';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import Testimonials from './components/Testimonials';
import Pricing from './components/Pricing';
import FAQ from './components/FAQ';
import Login from './components/Login';
import SignIn from './components/SignIn';
import Demo from './components/Demo';
import Dashboard from './components/Dashboard';
import PrivateRoute from './components/PrivateRoute';

function Home() {
  return (
    <>
      <Hero />
      <Demo />
      <Features />
      <HowItWorks />
      <Testimonials />
      <Pricing />
      <FAQ />
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signin" element={<SignIn />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

// console.log(import.meta.env);