import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  isLoading, 
  fullWidth = true,
  className = '',
  ...props 
}) => {
  const baseStyles = "relative font-bold py-3 px-6 rounded-full transition-all duration-200 active:scale-95 disabled:opacity-70 disabled:active:scale-100 shadow-xl flex items-center justify-center";
  
  const variants = {
    primary: "bg-black text-white hover:bg-gray-900 border-2 border-transparent",
    secondary: "bg-white text-black hover:bg-gray-100 border-2 border-transparent",
    glass: "bg-white/20 backdrop-blur-md border-2 border-white/40 hover:bg-white/30 text-white"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></span>
      ) : null}
      {children}
    </button>
  );
};

export default Button;
