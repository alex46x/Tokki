import React from 'react';

const Layout = ({ children, showFooter = true }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-start to-brand-end text-white flex flex-col items-center overflow-x-hidden font-sans">
      <div className="w-full max-w-md flex-grow flex flex-col p-4 md:p-6 relative z-10">
        {children}
      </div>
      
      {showFooter && (
        <footer className="w-full p-4 text-center text-white/60 text-xs mt-auto">
          <p>Tuki • Anonymous Messaging</p>
          <p className="mt-1">&copy; {new Date().getFullYear()} Tuki</p>
        </footer>
      )}
    </div>
  );
};

export default Layout;
