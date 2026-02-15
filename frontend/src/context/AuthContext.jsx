// import { createContext, useState, useEffect, useContext } from 'react';
// import {
//     onAuthStateChanged,
//     GoogleAuthProvider,
//     signInWithPopup,
//     signOut
// } from 'firebase/auth';
// import { doc, getDoc } from 'firebase/firestore';
// import { auth, db } from '../../firebase.config';

// const AuthContext = createContext(null);

// export const AuthProvider = ({ children }) => {
//     const [user, setUser] = useState(null);
//     const [loading, setLoading] = useState(true);

//     // Google Login Function
//     const googleLogin = async () => {
//         const provider = new GoogleAuthProvider();
//         try {
//             await signInWithPopup(auth, provider);
//             // The onAuthStateChanged listener will handle setting the user
//         } catch (error) {
//             console.error("Google Signapi-In Error:", error);
//             throw error;
//         }
//     };

//     // Logout Function
//     const logout = async () => {
//         try {
//             await signOut(auth);
//             setUser(null);
//         } catch (error) {
//             console.error("Logout Error:", error);
//         }
//     };

//     useEffect(() => {
//         // Listen for Firebase Auth state changes
//         const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
//             if (firebaseUser) {
//                 try {
//                     // Check if user exists in Firestore to get additional data (like username)
//                     const userDocRef = doc(db, 'users', firebaseUser.uid);
//                     const userSnap = await getDoc(userDocRef);

//                     if (userSnap.exists()) {
//                         // User exists in Firestore, merge auth data with firestore data
//                         setUser({
//                             uid: firebaseUser.uid,
//                             email: firebaseUser.email,
//                             photoURL: firebaseUser.photoURL,
//                             ...userSnap.data(),
//                             isUsernameSet: true // Flag to help routing
//                         });
//                     } else {
//                         // New user (or hasn't finished setup), set basic auth data
//                         setUser({
//                             uid: firebaseUser.uid,
//                             email: firebaseUser.email,
//                             photoURL: firebaseUser.photoURL,
//                             isUsernameSet: false // Flag to help routing
//                         });
//                     }
//                 } catch (error) {
//                     console.error("Error fetching user data:", error);
//                     // Fallback to basic auth user if firestore fails
//                     setUser({
//                         uid: firebaseUser.uid,
//                         email: firebaseUser.email,
//                         photoURL: firebaseUser.photoURL,
//                         isUsernameSet: false
//                     });
//                 }
//             } else {
//                 // No user logged in
//                 setUser(null);
//             }
//             setLoading(false);
//         });

//         // Cleanup subscription
//         return () => unsubscribe();
//     }, []);

//     return (
//         <AuthContext.Provider value={{ user, googleLogin, logout, loading }}>
//             {children}
//         </AuthContext.Provider>
//     );
// };

// export const useAuth = () => useContext(AuthContext);






















// import { createContext, useState, useEffect, useContext } from "react";
// import {
//   onAuthStateChanged,
//   GoogleAuthProvider,
//   signInWithPopup,
//   signInWithRedirect,
//   getRedirectResult,
//   signOut,
// } from "firebase/auth";
// import { doc, getDoc } from "firebase/firestore";
// import { auth, db } from "../../firebase.config";

// const AuthContext = createContext(null);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // -----------------------------
//   // Google Login (Desktop + Mobile safe)
//   // -----------------------------
//   const googleLogin = async () => {
//     const provider = new GoogleAuthProvider();
//     const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

//     try {
//       if (isMobile) {
//         // Mobile browsers require redirect-based login
//         await signInWithRedirect(auth, provider);
//       } else {
//         // Desktop browsers support popup login
//         await signInWithPopup(auth, provider);
//       }
//     } catch (error) {
//       console.error("Google Sign-In Error:", error);
//       throw error;
//     }
//   };

//   // -----------------------------
//   // Logout
//   // -----------------------------
//   const logout = async () => {
//     try {
//       await signOut(auth);
//       setUser(null);
//     } catch (error) {
//       console.error("Logout Error:", error);
//     }
//   };

//   // -----------------------------
//   // Handle redirect result (Mobile login)
//   // -----------------------------
//   useEffect(() => {
//     getRedirectResult(auth)
//       .then((result) => {
//         if (result?.user) {
//           // Auth state will be handled by onAuthStateChanged
//           console.log("Redirect login successful");
//         }
//       })
//       .catch((error) => {
//         console.error("Redirect login error:", error);
//       });
//   }, []);

//   // -----------------------------
//   // Listen to Auth State Changes
//   // -----------------------------
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
//       try {
//         if (firebaseUser) {
//           const userDocRef = doc(db, "users", firebaseUser.uid);
//           const userSnap = await getDoc(userDocRef);

//           if (userSnap.exists()) {
//             // User exists in Firestore
//             setUser({
//               uid: firebaseUser.uid,
//               email: firebaseUser.email,
//               photoURL: firebaseUser.photoURL,
//               ...userSnap.data(),
//               isUsernameSet: true,
//             });
//           } else {
//             // New user (setup not completed yet)
//             setUser({
//               uid: firebaseUser.uid,
//               email: firebaseUser.email,
//               photoURL: firebaseUser.photoURL,
//               isUsernameSet: false,
//             });
//           }
//         } else {
//           setUser(null);
//         }
//       } catch (error) {
//         console.error("Error fetching user data:", error);
//         if (firebaseUser) {
//           setUser({
//             uid: firebaseUser.uid,
//             email: firebaseUser.email,
//             photoURL: firebaseUser.photoURL,
//             isUsernameSet: false,
//           });
//         } else {
//           setUser(null);
//         }
//       } finally {
//         setLoading(false);
//       }
//     });

//     return () => unsubscribe();
//   }, []);

//   return (
//     <AuthContext.Provider value={{ user, googleLogin, logout, loading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);


















//new GPT CODE




// import { createContext, useState, useEffect, useContext } from "react";
// import {
//   onAuthStateChanged,
//   GoogleAuthProvider,
//   signInWithPopup,
//   signInWithRedirect,
//   signOut,
// } from "firebase/auth";
// import { doc, getDoc } from "firebase/firestore";
// import { auth, db } from "../../firebase.config";

// const AuthContext = createContext(null);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // -----------------------------------
//   // Google Login (Desktop + Mobile)
//   // -----------------------------------
//   const googleLogin = async () => {
//     const provider = new GoogleAuthProvider();
//     provider.setCustomParameters({
//       prompt: "select_account",
//     });

//     const isMobile =
//       /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

//     try {
//       if (isMobile) {
//         await signInWithRedirect(auth, provider);
//       } else {
//         await signInWithPopup(auth, provider);
//       }
//     } catch (err) {
//       console.error("Google login failed:", err);
//       throw err;
//     }
//   };

//   // -----------------------------------
//   // Logout
//   // -----------------------------------
//   const logout = async () => {
//     await signOut(auth);
//     setUser(null);
//   };

//   // -----------------------------------
//   // Auth State Listener (ONLY THIS)
//   // -----------------------------------
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
//       if (!firebaseUser) {
//         setUser(null);
//         setLoading(false);
//         return;
//       }

//       try {
//         const userRef = doc(db, "users", firebaseUser.uid);
//         const snap = await getDoc(userRef);

//         if (snap.exists()) {
//           setUser({
//             uid: firebaseUser.uid,
//             email: firebaseUser.email,
//             photoURL: firebaseUser.photoURL,
//             ...snap.data(),
//             isUsernameSet: true,
//           });
//         } else {
//           setUser({
//             uid: firebaseUser.uid,
//             email: firebaseUser.email,
//             photoURL: firebaseUser.photoURL,
//             isUsernameSet: false,
//           });
//         }
//       } catch (err) {
//         console.error("Firestore error:", err);
//         setUser({
//           uid: firebaseUser.uid,
//           email: firebaseUser.email,
//           photoURL: firebaseUser.photoURL,
//           isUsernameSet: false,
//         });
//       } finally {
//         setLoading(false);
//       }
//     });

//     return () => unsubscribe();
//   }, []);

//   return (
//     <AuthContext.Provider value={{ user, googleLogin, logout, loading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);




// Last 2



import { createContext, useState, useEffect, useContext } from "react";
import {
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebase.config";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Google Login (Desktop + Mobile SAFE)
  const googleLogin = async () => {
    const provider = new GoogleAuthProvider();

    // optional but recommended
    provider.setCustomParameters({
      prompt: "select_account",
    });

    try {
      await signInWithPopup(auth, provider);
      // Auth state handled by onAuthStateChanged
    } catch (error) {
      console.error("Google Login Error:", error);
      throw error;
    }
  };

  // Logout
  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  // ✅ Auth state listener (ONLY source of truth)
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (!firebaseUser) {
          setUser(null);
          setLoading(false);
          return;
        }

        const ref = doc(db, "users", firebaseUser.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            photoURL: firebaseUser.photoURL,
            ...snap.data(),
            isUsernameSet: true,
          });
        } else {
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            photoURL: firebaseUser.photoURL,
            isUsernameSet: false,
          });
        }
      } catch (err) {
        console.error("Auth fetch error:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  return (
    <AuthContext.Provider value={{ user, googleLogin, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
