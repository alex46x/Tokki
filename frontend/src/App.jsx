import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import SetupProfile from './pages/SetupProfile';
import Dashboard from './pages/Dashboard';
import PublicMessage from './pages/PublicMessage';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();
    
    if (loading) return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">Loading...</div>;
    
    if (!user) return <Navigate to="/" />;
    
    // If user hasn't set up profile, redirect to setup
    // But allow access to setup page itself
    if (!user.isUsernameSet && window.location.pathname !== '/setup') {
        return <Navigate to="/setup" />;
    }

    return children;
};

// Route that redirects logged in users away from login page
const PublicRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) return <div></div>;

    if (user) {
        if (!user.isUsernameSet) return <Navigate to="/setup" />;
        return <Navigate to="/dashboard" />;
    }

    return children;
};

function App() {
  return (
    <Router>
        <AuthProvider>
            <Routes>
                <Route path="/" element={<PublicRoute><Login /></PublicRoute>} />
                {/* Signup route removed */}
                <Route path="/setup" element={<PrivateRoute><SetupProfile /></PrivateRoute>} />
                <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                <Route path="/u/:username" element={<PublicMessage />} />
            </Routes>
        </AuthProvider>
    </Router>
  );
}

export default App;


















// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import Login from "./pages/Login";
// import SetupProfile from "./pages/SetupProfile";
// import Dashboard from "./pages/Dashboard";
// import PublicMessage from "./pages/PublicMessage";
// import { useAuth } from "./context/AuthContext";

// const App = () => {
//   const { user, profile, loading } = useAuth();

//   if (loading) return null;

//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route
//           path="/"
//           element={
//             !user ? (
//               <Login />
//             ) : !profile ? (
//               <Navigate to="/setup" />
//             ) : (
//               <Navigate to="/dashboard" />
//             )
//           }
//         />

//         <Route
//           path="/setup"
//           element={!user ? <Navigate to="/" /> : <SetupProfile />}
//         />

//         <Route
//           path="/dashboard"
//           element={!user ? <Navigate to="/" /> : <Dashboard />}
//         />
//         <Route path="/u/:username" element={<PublicMessage />} />
//       </Routes>
//     </BrowserRouter>
//   );
// };

// export default App;
