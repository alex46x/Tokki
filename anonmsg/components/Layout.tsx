import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  showFooter?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, showFooter = true }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-start to-brand-end text-white flex flex-col items-center overflow-x-hidden">
      <div className="w-full max-w-md flex-grow flex flex-col p-4 md:p-6 relative z-10">
        {children}
      </div>
      
      {showFooter && (
        <footer className="w-full p-4 text-center text-white/60 text-xs mt-auto">
          <p>Mock Application • NGL Clone</p>
          <p className="mt-1">&copy; {new Date().getFullYear()} AnonMsg</p>
        </footer>
      )}
    </div>
  );
};

export default Layout;