import React from 'react';

export const ListeningIndicator: React.FC = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1">
        <div className="w-1 h-8 bg-listening rounded-full animate-[pulse_0.8s_ease-in-out_infinite]" />
        <div className="w-1 h-12 bg-listening rounded-full animate-[pulse_0.8s_ease-in-out_0.2s_infinite]" />
        <div className="w-1 h-6 bg-listening rounded-full animate-[pulse_0.8s_ease-in-out_0.4s_infinite]" />
        <div className="w-1 h-10 bg-listening rounded-full animate-[pulse_0.8s_ease-in-out_0.6s_infinite]" />
        <div className="w-1 h-8 bg-listening rounded-full animate-[pulse_0.8s_ease-in-out_0.8s_infinite]" />
      </div>
    </div>
  );
};
