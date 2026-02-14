import { useState, useEffect } from 'react';
import { db } from '../../firebase.config';
import { collection, query, where, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import Button from '../components/Button';
import { Copy, Trash2, ExternalLink, LogOut, Inbox, RefreshCw } from 'lucide-react';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [copied, setCopied] = useState(false);

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
                    <button className="p-2 hover:bg-white/20 rounded-full transition active:rotate-180">
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
                                    {msg.content}
                                </div>
                                <div className="text-xs text-gray-400 font-medium">
                                    {new Date(msg.createdAt).toLocaleString()}
                                </div>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); deleteMessage(msg._id); }}
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
