import React from 'react';

interface AndroidFrameProps {
  children: React.ReactNode;
  displayMode: 'device' | 'fullscreen';
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({ children }) => {
  return (
    <div className="w-full min-h-screen bg-black text-white">
      {children}
    </div>
  );
};