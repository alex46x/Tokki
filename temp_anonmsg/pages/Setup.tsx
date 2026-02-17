import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Button from '../components/Button';
import { MockUserService } from '../services/mockBackend';
import { Camera, User as UserIcon } from 'lucide-react';

const Setup: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [photoUrl, setPhotoUrl] = useState('https://picsum.photos/200');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If not logged in, go to login
  if (!user) return <Navigate to="/login" replace />;
  // If already set up, go to dashboard
  if (user.username) return <Navigate to="/dashboard" replace />;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // In a real app, upload to Cloudinary here. 
      // We will just create a fake local URL for the preview.
      const url = URL.createObjectURL(e.target.files[0]);
      setPhotoUrl(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (!username.match(/^[a-zA-Z0-9_]{3,20}$/)) {
      setError("Username must be 3-20 chars, letters/numbers only.");
      return;
    }

    setIsSubmitting(true);
    try {
      await MockUserService.updateProfile(user._id, username, photoUrl);
      await refreshUser(); // Update context
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout showFooter={false}>
      <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold">Create Profile</h2>
          <p className="text-white/80">Choose your unique link</p>
        </div>

        <div className="relative group cursor-pointer">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl bg-gray-200">
            <img src={photoUrl} alt="Profile" className="w-full h-full object-cover" />
          </div>
          <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
            {/* <Camera className="w-8 h-8 text-white" />
            <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} /> */}
          </label>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold ml-2">Username</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                <UserIcon className="w-5 h-5" />
              </div>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().trim())}
                className="w-full pl-12 pr-4 py-4 rounded-2xl text-black font-semibold focus:outline-none focus:ring-4 focus:ring-white/30"
                placeholder="your_username"
                required
              />
            </div>
            {error && <p className="text-white bg-red-500/50 p-2 rounded-lg text-sm text-center font-semibold">{error}</p>}
          </div>

          <div className="bg-white/10 p-4 rounded-xl text-sm text-white/80 text-center">
            ⚠️ You can only set your username once. Choose wisely!
          </div>

          <Button type="submit" variant="secondary" isLoading={isSubmitting}>
            Complete Setup
          </Button>
        </form>
      </div>
    </Layout>
  );
};

export default Setup;