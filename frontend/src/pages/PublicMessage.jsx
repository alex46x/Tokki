import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../../firebase.config';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import Layout from '../components/Layout';
import Button from '../components/Button';
import { Send, CheckCircle2 } from 'lucide-react';

const PublicMessage = () => {
    const { username } = useParams();
    const [recipient, setRecipient] = useState(null);
    const [message, setMessage] = useState('');
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const q = query(collection(db, 'users'), where('username', '==', username));
                const querySnapshot = await getDocs(q);

                if (querySnapshot.empty) {
                    setRecipient(null);
                } else {
                    const userData = querySnapshot.docs[0].data();
                    setRecipient({ ...userData, uid: querySnapshot.docs[0].id });
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [username]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!message.trim() || !recipient) return;
        
        setSending(true);
        try {
            await addDoc(collection(db, 'messages'), {
                receiverUid: recipient.uid,
                receiverUsername: recipient.username,
                content: message,
                createdAt: new Date().toISOString()
            });
            setSent(true);
            setMessage('');
        } catch (err) {
            console.error(err);
            alert("Failed to send");
        } finally {
            setSending(false);
        }
    };

    if (loading) {
        return <Layout><div className="flex h-screen items-center justify-center">Loading...</div></Layout>;
    }

    if (!recipient) {
        return (
            <Layout>
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
                    <div className="text-6xl">😕</div>
                    <h2 className="text-2xl font-bold">User not found</h2>
                    <Link to="/" className="underline text-white/80">Go Home</Link>
                </div>
            </Layout>
        );
    }

    if (sent) {
        return (
            <Layout>
                <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-8 animate-bounce-in">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-green-500 shadow-2xl">
                        <CheckCircle2 className="w-12 h-12" />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-4xl font-black">Sent!</h1>
                        <p className="text-lg opacity-90">Your message is delivered safely.</p>
                    </div>
                    <div className="w-full pt-8 space-y-4">
                        <Button onClick={() => setSent(false)} variant="glass">
                            Send another message
                        </Button>
                        <div className="text-sm opacity-70">or</div>
                        <Link to="/" className="block">
                            <Button variant="secondary">
                                👇 Get your own messages!
                            </Button>
                        </Link>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout showFooter={false}>
            <div className="flex flex-col items-center pt-10 pb-6 space-y-6">
                
                {/* Profile Header */}
                <div className="flex flex-col items-center space-y-3">
                    <div className="p-1 bg-white/20 rounded-full">
                         {recipient.photoURL ? (
                             <img 
                                 src={recipient.photoURL} 
                                 alt={recipient.username} 
                                 className="w-24 h-24 rounded-full border-4 border-white object-cover shadow-xl"
                             />
                         ) : (
                             <div className="w-24 h-24 rounded-full bg-white text-rose-500 flex items-center justify-center text-4xl font-bold border-4 border-white shadow-xl">
                                 {recipient.username[0].toUpperCase()}
                             </div>
                         )}
                    </div>
                    <h1 className="text-2xl font-bold shadow-black drop-shadow-sm">@{recipient.username}</h1>
                    <p className="text-sm font-medium bg-black/20 px-4 py-1 rounded-full backdrop-blur-sm">
                        Send me anonymous messages!
                    </p>
                </div>

                {/* Message Form */}
                <form onSubmit={handleSend} className="w-full max-w-sm space-y-6">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-white/20 blur-xl rounded-full transform group-hover:scale-105 transition-transform duration-500"></div>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Send me an anonymous message..."
                            className="relative w-full h-40 p-6 rounded-3xl text-black font-bold text-xl placeholder:text-gray-400 placeholder:font-bold focus:outline-none focus:ring-4 focus:ring-white/50 resize-none shadow-2xl"
                            maxLength={300}
                            required
                        />
                        <div className="absolute bottom-4 right-4 text-xs font-bold text-gray-400 pointer-events-none">
                            {message.length}/300
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Button 
                            type="submit" 
                            variant="secondary" 
                            isLoading={sending}
                            className="h-16 text-lg shadow-xl"
                        >
                            {!sending && <Send className="w-5 h-5 mr-2" />}
                            Send It! 🚀
                        </Button>
                        
                        <p className="text-xs text-center text-white/50 px-4">
                            By sending, you agree to our Terms. Your identity is kept secret.
                        </p>
                    </div>
                </form>

                <div className="mt-auto pt-10">
                    <Link to="/" className="text-white/80 font-bold text-sm hover:underline">
                        Get your own link on Tokki
                    </Link>
                </div>

            </div>
        </Layout>
    );
};

export default PublicMessage;
