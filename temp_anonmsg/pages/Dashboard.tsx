import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { MockMessageService } from '../services/mockBackend';
import { Message } from '../types';
import { Copy, Trash2, ExternalLink, LogOut, Inbox, RefreshCw } from 'lucide-react';
import Button from '../components/Button';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (user?.username) {
      loadMessages();
    }
  }, [user]);

  const loadMessages = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const msgs = await MockMessageService.getMyMessages(user._id);
      setMessages(msgs);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this message?')) return;
    await MockMessageService.deleteMessage(id);
    setMessages(prev => prev.filter(m => m._id !== id));
  };

  // Helper to get the correct base URL even if hosted in a subpath
  const getProfileLink = () => {
    if (!user?.username) return '';
    // Uses the full current URL (excluding the hash) to ensure sub-paths are preserved
    const baseUrl = window.location.href.split('#')[0];
    return `${baseUrl}#/u/${user.username}`;
  };

  const copyLink = () => {
    const url = getProfileLink();
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!user) return <Navigate to="/login" replace />;
  if (!user.username) return <Navigate to="/setup" replace />;

  const profileLink = getProfileLink();

  return (
    <Layout>
      <div className="space-y-6 pb-20">
        
        {/* Header */}
        <div className="flex items-center justify-between pt-4">
          <div className="flex items-center space-x-3">
            <img src={user.profilePhoto} alt="Me" className="w-10 h-10 rounded-full border-2 border-white" />
            <span className="font-bold text-lg">@{user.username}</span>
          </div>
          <button onClick={logout} className="p-2 hover:bg-white/20 rounded-full transition">
            <LogOut className="w-5 h-5" />
          </button>
        </div>

        {/* Share Card */}
        <div className="bg-white/20 backdrop-blur-md rounded-3xl p-6 border border-white/30 text-center space-y-4 shadow-xl">
          <h2 className="text-xl font-bold">Your Personal Link 🔗</h2>
          <div className="bg-black/20 p-3 rounded-xl break-all text-sm font-mono text-white/80 select-all">
            {profileLink}
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={copyLink} 
              variant={copied ? "secondary" : "glass"} 
              className="flex-1 text-sm py-2"
            >
              {copied ? "Copied!" : <><Copy className="w-4 h-4 mr-2" /> Copy Link</>}
            </Button>
            <a href={profileLink} target="_blank" rel="noreferrer" className="flex-1">
              <Button variant="glass" className="w-full text-sm py-2">
                <ExternalLink className="w-4 h-4 mr-2" /> View
              </Button>
            </a>
          </div>
          <p className="text-xs text-white/70">
            Share this link on your Instagram Story or Snapchat to get anonymous messages!
          </p>
        </div>

        {/* Inbox Header */}
        <div className="flex items-center justify-between px-2">
          <h3 className="text-xl font-bold flex items-center">
            <Inbox className="w-5 h-5 mr-2" /> Inbox
          </h3>
          <button onClick={loadMessages} className="p-2 hover:bg-white/20 rounded-full transition active:rotate-180">
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>

        {/* Messages List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-10 opacity-70">Loading messages...</div>
          ) : messages.length === 0 ? (
            <div className="text-center py-12 bg-white/10 rounded-3xl border border-dashed border-white/30">
              <div className="text-4xl mb-3">📭</div>
              <p className="font-medium">No messages yet!</p>
              <p className="text-sm text-white/60 mt-2">Share your link to get started.</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg._id} className="bg-white text-black rounded-3xl p-6 shadow-lg relative group transition hover:scale-[1.01]">
                <div className="font-bold text-lg mb-2 break-words leading-snug">
                  {msg.message}
                </div>
                <div className="text-xs text-gray-400 font-medium">
                  {new Date(msg.createdAt).toLocaleString()}
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); handleDelete(msg._id); }}
                  className="absolute top-4 right-4 text-gray-300 hover:text-red-500 p-2 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

      </div>
    </Layout>
  );
};

export default Dashboard;