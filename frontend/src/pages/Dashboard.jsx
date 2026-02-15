import { useState, useEffect } from 'react';
import { db } from '../../firebase.config';
import { collection, query, where, onSnapshot, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import Button from '../components/Button';
import ProfileShareCard from '../components/ProfileShareCard';
import MessageShareCard from '../components/MessageShareCard';
import { Copy, Trash2, LogOut, Inbox, Share2, MessageCircle } from 'lucide-react';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [copied, setCopied] = useState(false);
    
    // New State for Share Cards
    const [showProfileShare, setShowProfileShare] = useState(false);
    const [selectedMessageForReply, setSelectedMessageForReply] = useState(null);

    useEffect(() => {
        if (!user) return;
        
        setIsLoading(true);
        const q = query(
            collection(db, 'messages'), 
            where('receiverUid', '==', user.uid)
        );
        
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const msgs = [];
            querySnapshot.forEach((doc) => {
                msgs.push({ ...doc.data(), _id: doc.id });
            });
            msgs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setMessages(msgs);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const copyLink = () => {
        const link = `${window.location.origin}/u/${user.username}`;
        navigator.clipboard.writeText(link);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const deleteMessage = async (id) => {
        if (!confirm('Delete this message?')) return;
        try {
            await deleteDoc(doc(db, 'messages', id));
        } catch (err) {
            console.error(err);
        }
    };

    // New Function: Mark message as read
    const markAsRead = async (msg) => {
        if (msg.seen) return;
        try {
            await updateDoc(doc(db, 'messages', msg._id), { seen: true });
        } catch (err) {
            console.error("Error marking as read", err);
        }
    };

    const handleReplyClick = (msg) => {
        markAsRead(msg);
        setSelectedMessageForReply(msg);
    };

    const profileLink = `${window.location.origin}/u/${user?.username}`;

    return (
        <Layout>
            <div className="space-y-6 pb-20">
                
                {/* Header */}
                <div className="flex items-center justify-between pt-4">
                    <div className="flex items-center space-x-3">
                        {user?.photoURL ? (
                            <img src={user.photoURL} alt="Me" className="w-10 h-10 rounded-full border-2 border-white" />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-white text-rose-500 flex items-center justify-center font-bold border-2 border-white">
                                {user?.username?.[0]?.toUpperCase()}
                            </div>
                        )}
                        <span className="font-bold text-lg">@{user?.username}</span>
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
                        <Button 
                            onClick={() => setShowProfileShare(true)}
                            variant="primary" 
                            className="flex-1 text-sm py-2 bg-gradient-to-r from-rose-500 to-orange-500 border-none"
                        >
                            <Share2 className="w-4 h-4 mr-2" /> Share Profile
                        </Button>
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
                    <div className="text-sm bg-white/20 px-3 py-1 rounded-full font-medium">
                        {messages.filter(m => !m.seen).length} new
                    </div>
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
                            <div 
                                key={msg._id} 
                                onClick={() => markAsRead(msg)}
                                className={`
                                    relative bg-white text-black rounded-3xl p-6 shadow-lg transition-transform hover:scale-[1.01] cursor-pointer
                                    ${!msg.seen ? 'border-2 border-rose-500' : ''}
                                `}
                            >
                                {/* Unread Indicator */}
                                {!msg.seen && (
                                    <div className="absolute top-4 right-4 w-3 h-3 bg-rose-500 rounded-full animate-pulse shadow-md"></div>
                                )}

                                <div className="font-bold text-lg mb-4 break-words leading-snug pr-8">
                                    {msg.content}
                                </div>
                                
                                <div className="flex items-center justify-between mt-4 border-t border-gray-100 pt-3">
                                    <div className="text-xs text-gray-400 font-medium">
                                        {new Date(msg.createdAt).toLocaleString()}
                                    </div>
                                    
                                    <div className="flex space-x-2">
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); deleteMessage(msg._id); }}
                                            className="text-gray-300 hover:text-red-500 p-2 transition-colors rounded-full hover:bg-red-50"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); handleReplyClick(msg); }}
                                            className="bg-black text-white px-4 py-2 rounded-full text-xs font-bold flex items-center hover:bg-gray-800 transition shadow-md"
                                        >
                                            <MessageCircle className="w-3 h-3 mr-1" /> Reply / Share
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Modals */}
                {showProfileShare && (
                    <ProfileShareCard 
                        user={user} 
                        onClose={() => setShowProfileShare(false)} 
                    />
                )}

                {selectedMessageForReply && (
                    <MessageShareCard 
                        message={selectedMessageForReply} 
                        user={user} 
                        onClose={() => setSelectedMessageForReply(null)} 
                    />
                )}

            </div>
        </Layout>
    );
};

export default Dashboard;
