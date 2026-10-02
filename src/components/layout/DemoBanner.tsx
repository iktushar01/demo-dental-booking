import React, { useState } from 'react';
import { useRouter } from '../../lib/router';
import { useAuthStore } from '../../store/useAuthStore';
import { Sparkles, X, User, ShieldCheck } from 'lucide-react';

export const DemoBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const { navigate } = useRouter();
  const { currentUser, login } = useAuthStore();

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 text-teal-100 text-xs py-2 px-4 border-b border-teal-700/50 relative z-40 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-center sm:text-left">
          <span className="p-1 rounded-md bg-teal-500/20 text-teal-300">
            <Sparkles className="w-3.5 h-3.5" />
          </span>
          <span>
            <strong className="text-white font-medium">Interactive Demo</strong> · Front-end only with localStorage persistence.
          </span>
        </div>

        <div className="flex items-center gap-2">
          {!currentUser ? (
            <>
              <button
                onClick={() => {
                  login('user@demo.com', 'user123');
                  navigate('/account');
                }}
                className="px-2.5 py-1 rounded-md bg-teal-700/60 hover:bg-teal-700 text-white font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <User className="w-3 h-3 text-teal-300" />
                Demo Patient
              </button>
              <button
                onClick={() => {
                  login('admin@demo.com', 'admin123');
                  navigate('/admin');
                }}
                className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-teal-200 font-medium transition-colors flex items-center gap-1.5 cursor-pointer border border-teal-600/30"
              >
                <ShieldCheck className="w-3 h-3 text-teal-400" />
                Demo Admin
              </button>
            </>
          ) : (
            <span className="text-teal-200">
              Logged in as <strong className="text-white">{currentUser.name}</strong> ({currentUser.role})
            </span>
          )}

          <button
            onClick={() => setIsVisible(false)}
            className="p-1 hover:text-white transition-colors ml-1 cursor-pointer"
            aria-label="Dismiss banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
