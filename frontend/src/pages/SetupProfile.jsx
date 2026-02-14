import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, storage } from '../../firebase.config';
import { collection, query, where, getDocs, doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import Button from '../components/Button';
import { Camera, User } from 'lucide-react';

const SetupProfile = () => {
    const { user, loading } = useAuth(); 
    const navigate = useNavigate();
    
    const [username, setUsername] = useState('');
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState('https://picsum.photos/200'); // Default placeholder
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!loading && user?.isUsernameSet) {
            navigate('/dashboard');
        }
    }, [user, loading, navigate]);

    useEffect(() => {
        if (user?.photoURL) {
            setPreview(user.photoURL);
        }
    }, [user]);

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setFile(e.target.files[0]);
            setPreview(URL.createObjectURL(e.target.files[0]));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        // Basic validation
        if (!username.match(/^[a-zA-Z0-9_]{3,20}$/)) {
             setError("Username must be 3-20 chars, letters/numbers only.");
             return;
        }

        setIsSubmitting(true);

        try {
            // 1. Check uniqueness
            const q = query(collection(db, 'users'), where('username', '==', username.toLowerCase()));
            const querySnapshot = await getDocs(q);
            
            if (!querySnapshot.empty) {
                setError('Username already taken');
                setIsSubmitting(false);
                return;
            }

            // 2. Upload photo if exists
            let photoURL = user.photoURL || ''; 
            if (file) {
                const storageRef = ref(storage, `profile_photos/${user.uid}`);
                await uploadBytes(storageRef, file);
                photoURL = await getDownloadURL(storageRef);
            }

            // 3. Save to Firestore
            await setDoc(doc(db, 'users', user.uid), {
                uid: user.uid,
                email: user.email,
                username: username.toLowerCase(),
                photoURL,
                createdAt: new Date().toISOString()
            });

            // Force reload or redirect
            window.location.reload(); 

        } catch (err) {
            console.error(err);
            setError('Failed to setup profile');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return null;

    return (
        <Layout showFooter={false}>
            <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-8">
                <div className="text-center space-y-2">
                    <h2 className="text-3xl font-bold">Create Profile</h2>
                    <p className="text-white/80">Choose your unique link</p>
                </div>

                <div className="relative group cursor-pointer w-32 h-32">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl bg-gray-200">
                        <img src={preview} alt="Profile" className="w-full h-full object-cover" />
                    </div>
                    <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                        <Camera className="w-8 h-8 text-white" />
                        <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                    </label>
                </div>

                <form onSubmit={handleSubmit} className="w-full space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold ml-2">Username</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                                <User className="w-5 h-5" />
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
                        {error && (
                            <p className="text-white bg-red-500/50 p-2 rounded-lg text-sm text-center font-semibold">
                                {error}
                            </p>
                        )}
                    </div>

                    <div className="bg-white/10 p-4 rounded-xl text-sm text-white/80 text-center border border-white/10">
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

export default SetupProfile;
