import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Button from '../components/Button';
import { MessageSquare, ShieldCheck, Zap } from 'lucide-react';

const Login: React.FC = () => {
  const { login, isAuthenticated, user, isLoading } = useAuth();

  if (isAuthenticated && user) {
    if (!user.username) {
      return <Navigate to="/setup" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center flex-grow space-y-12 py-10">
        
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <div className="w-24 h-24 bg-white rounded-3xl mx-auto shadow-2xl flex items-center justify-center transform rotate-6 mb-6">
            <span className="text-5xl">🤫</span>
          </div>
          <h1 className="text-5xl font-black tracking-tight drop-shadow-md">
            AnonMsg
          </h1>
          <p className="text-xl font-medium text-white/90">
            Get anonymous messages!
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 gap-4 w-full px-4">
          <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl flex items-center space-x-3 border border-white/20">
            <MessageSquare className="w-6 h-6 text-white" />
            <span className="font-semibold">Receive anonymous Qs</span>
          </div>
          <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl flex items-center space-x-3 border border-white/20">
            <ShieldCheck className="w-6 h-6 text-white" />
            <span className="font-semibold">100% Safe & Secure</span>
          </div>
          <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl flex items-center space-x-3 border border-white/20">
            <Zap className="w-6 h-6 text-white" />
            <span className="font-semibold">Share on your story</span>
          </div>
        </div>

        {/* Action */}
        <div className="w-full space-y-4 pt-8">
          <Button 
            onClick={() => login()} 
            variant="secondary"
            isLoading={isLoading}
            className="text-lg"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" />
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </Button>
          <p className="text-xs text-center text-white/60">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Login;