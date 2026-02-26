import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import Button from '../components/Button';
import InfoSheetModal from '../components/InfoSheetModal';
import { MessageSquare, ShieldCheck, Zap } from 'lucide-react';

const SEO_TITLE = 'Tukichat | Get anonymous messages';
const SEO_DESCRIPTION =
    'Tukichat (Tuki) is a modern anonymous messaging app for honest, safe, and fun conversations with friends and followers.';
const CANONICAL_URL = 'https://tukichat.app/';

const upsertMetaTag = (key, content, attribute = 'name') => {
    let tag = document.head.querySelector(`meta[${attribute}="${key}"]`);
    const wasCreated = !tag;
    const previousContent = tag?.getAttribute('content') ?? null;

    if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attribute, key);
        document.head.appendChild(tag);
    }

    tag.setAttribute('content', content);

    return () => {
        if (wasCreated) {
            tag.remove();
            return;
        }

        if (previousContent === null) {
            tag.removeAttribute('content');
        } else {
            tag.setAttribute('content', previousContent);
        }
    };
};

const PrivacyPolicyContent = () => (
    <div className="space-y-5">
        <section className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-start">Last updated: February 26, 2026</p>
            <p>
                At Tukichat, we believe anonymity should feel safe, respectful, and trustworthy. This Privacy Policy
                explains what we collect, what we do not collect, and how we protect your data.
            </p>
        </section>

        <section className="space-y-2">
            <h3 className="text-base font-bold text-gray-900">What data we collect</h3>
            <ul className="list-disc space-y-1 pl-5">
                <li>Google account email and profile photo, used only to create and manage your Tuki account.</li>
                <li>Anonymous messages sent through Tukichat so they can be delivered to the receiver.</li>
            </ul>
        </section>

        <section className="space-y-2">
            <h3 className="text-base font-bold text-gray-900">What we do not collect</h3>
            <ul className="list-disc space-y-1 pl-5">
                <li>Sender identity for anonymous messages.</li>
                <li>Phone number.</li>
                <li>Precise location data.</li>
            </ul>
        </section>

        <section className="space-y-2">
            <h3 className="text-base font-bold text-gray-900">How messages are stored</h3>
            <p>
                Messages are stored in a secure cloud database with standard access controls and technical safeguards.
                We store only what is required for delivery, inbox display, and message management.
            </p>
        </section>

        <section className="space-y-2">
            <h3 className="text-base font-bold text-gray-900">Who can read messages</h3>
            <p>
                Only the intended receiver can read their messages inside their account. Tukichat is designed so
                private inbox content stays private.
            </p>
            <p>
                Admins do not read private messages as part of normal operations. Access to user content is restricted
                by design.
            </p>
        </section>

        <section className="space-y-2">
            <h3 className="text-base font-bold text-gray-900">Cookies and analytics</h3>
            <p>
                We use basic cookies and analytics to understand app performance, reliability, and usage trends. We do
                not use this data to identify anonymous message senders.
            </p>
        </section>

        <section className="space-y-2">
            <h3 className="text-base font-bold text-gray-900">Data security and protection</h3>
            <p>
                We use industry-standard protections, including encrypted connections and secure infrastructure. No
                internet service is risk-free, but we continuously improve our safeguards.
            </p>
        </section>

        <section className="space-y-2">
            <h3 className="text-base font-bold text-gray-900">Your rights and controls</h3>
            <ul className="list-disc space-y-1 pl-5">
                <li>You can delete messages from your inbox at any time.</li>
                <li>You can request account deletion and data removal.</li>
            </ul>
        </section>

        <section className="space-y-2">
            <h3 className="text-base font-bold text-gray-900">Contact</h3>
            <p>
                Questions or requests: <a className="font-semibold text-brand-start hover:underline" href="mailto:support@tukichat.app">shimulmondal246@gmail.com</a>
            </p>
        </section>
    </div>
);

const AboutTukiContent = () => (
    <div className="space-y-5">
        <section className="space-y-2">
            <p>
                Tuki started with one simple idea: people often want to say what they truly feel, but they need a safe
                space to say it honestly.
            </p>
            <p>
                I built Tukichat to make anonymous expression feel human, thoughtful, and fun, not toxic. Curiosity,
                honesty, and connection are at the heart of this product.
            </p>
        </section>

        <section className="space-y-2">
            <h3 className="text-base font-bold text-gray-900">Why Tuki exists</h3>
            <p>
                Social apps are loud. Real conversations are often quiet. Tuki gives people a simple way to ask, share,
                and respond without pressure.
            </p>
        </section>

        <section className="space-y-2">
            <h3 className="text-base font-bold text-gray-900">Our values</h3>
            <ul className="list-disc space-y-1 pl-5">
                <li>Safe anonymous expression.</li>
                <li>Honesty without harassment.</li>
                <li>Fun without crossing boundaries.</li>
            </ul>
            <p>
                Tuki has a strict no hate, no abuse policy. Anonymous should never mean harmful.
            </p>
        </section>

        <section className="space-y-2">
            <h3 className="text-base font-bold text-gray-900">Built independently</h3>
            <p>
                Tukichat is built by an independent developer with a startup mindset: move fast, listen closely, and
                improve constantly based on real user feedback.
            </p>
        </section>

        <section className="space-y-2">
            <h3 className="text-base font-bold text-gray-900">The future of Tuki</h3>
            <p>
                The vision is to keep building a trusted place for meaningful anonymous conversations, with stronger
                safety tools, better creator features, and smarter moderation that protects people while keeping the
                experience light and fun.
            </p>
        </section>

        <section className="space-y-2">
            <p className="font-semibold text-gray-900">
                Thanks for being part of Tuki.
            </p>
            <p>
                This app exists because people still value honest words.
            </p>
        </section>
    </div>
);

const Login = () => {
    const { googleLogin, user, loading } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [activeModal, setActiveModal] = useState(null);
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

    useEffect(() => {
        if (user) {
            if (user.isUsernameSet) {
                navigate('/dashboard');
            } else {
                navigate('/setup');
            }
        }
    }, [user, navigate]);

    useEffect(() => {
        const previousTitle = document.title;
        document.title = SEO_TITLE;

        const cleanups = [
            upsertMetaTag('description', SEO_DESCRIPTION),
            upsertMetaTag('keywords', 'Tukichat, Tuki, anonymous messaging app, anonymous messages, get anonymous messages'),
            upsertMetaTag('og:title', SEO_TITLE, 'property'),
            upsertMetaTag('og:description', SEO_DESCRIPTION, 'property'),
            upsertMetaTag('og:type', 'website', 'property'),
            upsertMetaTag('og:url', CANONICAL_URL, 'property'),
            upsertMetaTag('twitter:card', 'summary'),
            upsertMetaTag('twitter:title', SEO_TITLE),
            upsertMetaTag('twitter:description', SEO_DESCRIPTION)
        ];

        let canonical = document.head.querySelector('link[rel="canonical"]');
        const createdCanonical = !canonical;
        const previousCanonicalHref = canonical?.getAttribute('href') ?? null;

        if (!canonical) {
            canonical = document.createElement('link');
            canonical.setAttribute('rel', 'canonical');
            document.head.appendChild(canonical);
        }
        canonical.setAttribute('href', CANONICAL_URL);

        let schemaTag = document.getElementById('tuki-home-schema');
        const createdSchemaTag = !schemaTag;
        const previousSchema = schemaTag?.textContent ?? '';

        if (!schemaTag) {
            schemaTag = document.createElement('script');
            schemaTag.setAttribute('id', 'tuki-home-schema');
            schemaTag.setAttribute('type', 'application/ld+json');
            document.head.appendChild(schemaTag);
        }

        schemaTag.textContent = JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'Tukichat',
            alternateName: 'Tuki',
            url: CANONICAL_URL,
            description: SEO_DESCRIPTION,
            applicationCategory: 'SocialNetworkingApplication',
            operatingSystem: 'Any'
        });

        return () => {
            document.title = previousTitle;
            cleanups.forEach((cleanup) => cleanup());

            if (createdCanonical) {
                canonical.remove();
            } else if (previousCanonicalHref === null) {
                canonical.removeAttribute('href');
            } else {
                canonical.setAttribute('href', previousCanonicalHref);
            }

            if (createdSchemaTag) {
                schemaTag.remove();
            } else {
                schemaTag.textContent = previousSchema;
            }
        };
    }, []);

    const handleGoogleLogin = async () => {
        try {
            setError('');
            await googleLogin();
        } catch (err) {
            setError('Failed to login with Google');
            console.error(err);
        }
    };

    const openPrivacyModal = () => {
        setActiveModal('privacy');
        setIsInfoModalOpen(true);
    };

    const openAboutModal = () => {
        setActiveModal('about');
        setIsInfoModalOpen(true);
    };

    const closeModal = () => setIsInfoModalOpen(false);

    if (loading) return null;

    return (
        <Layout>
            <div className="flex flex-col items-center justify-center flex-grow space-y-12 py-10">
                
                {/* Hero Section */}
                <div className="text-center space-y-4">
                    <div className="w-24 h-24 bg-white rounded-3xl mx-auto shadow-2xl flex items-center justify-center transform rotate-6 mb-6">
                        <span className="text-5xl">🤫</span>
                    </div>
                    <h1 className="text-5xl font-black tracking-tight drop-shadow-md">
                        Tuki
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
                    {error && (
                        <div className="text-center bg-red-500/80 text-white p-2 rounded-lg text-sm font-bold">
                            {error}
                        </div>
                    )}
                    
                    <Button 
                        onClick={handleGoogleLogin} 
                        variant="secondary"
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
                    <p className="text-xs text-center text-white/70 leading-relaxed">
                        By continuing, you agree to our{' '}
                        <button
                            type="button"
                            onClick={openPrivacyModal}
                            className="font-semibold underline underline-offset-2 decoration-white/70 hover:text-white transition"
                        >
                            Privacy Policy
                        </button>{' '}
                        and{' '}
                        <button
                            type="button"
                            onClick={openAboutModal}
                            className="font-semibold underline underline-offset-2 decoration-white/70 hover:text-white transition"
                        >
                            About Tuki
                        </button>
                        .
                    </p>
                </div>
            </div>

            <InfoSheetModal
                isOpen={isInfoModalOpen}
                onClose={closeModal}
                title={activeModal === 'privacy' ? 'Privacy Policy' : 'About Tuki'}
                descriptionId={activeModal === 'privacy' ? 'privacy-policy-content' : 'about-tuki-content'}
            >
                {activeModal === 'privacy' ? <PrivacyPolicyContent /> : null}
                {activeModal === 'about' ? <AboutTukiContent /> : null}
            </InfoSheetModal>
        </Layout>
    );
};

export default Login;
